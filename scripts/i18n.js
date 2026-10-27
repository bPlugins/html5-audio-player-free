// Regenerates .pot/.po/.json/.mo via WP-CLI. make-pot needs mbstring, which Local's bare
// `php` binary lacks (no php.ini), so fall back to a Local site's php.ini via PHPRC.
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const args = Object.fromEntries(
	process.argv.slice(2).map((arg) => {
		const [key, ...rest] = arg.replace(/^--/, '').split('=');
		return [key, rest.join('=')];
	})
);

if (!args.pot || !args.po) {
	console.error('Usage: node scripts/i18n.js --pot=<file.pot> --po=<file.po>');
	process.exit(1);
}

function hasMbstring(env) {
	try {
		const modules = execSync('php -m', { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
		return /^mbstring$/im.test(modules);
	} catch (e) {
		return false;
	}
}

// A throwaway php.ini enabling the PHP binary's own bundled extensions that WP-CLI needs:
// mbstring for make-pot, curl/openssl because make-pot downloads block-i18n.json for block.json files.
function minimalPhpConfigDir() {
	try {
		const phpBinary = execSync('php -r "echo PHP_BINARY;"', {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim();
		const extDir = path.join(path.dirname(phpBinary), 'ext');
		const available = (name) =>
			[`php_${name}.dll`, `${name}.so`].some((file) => fs.existsSync(path.join(extDir, file)));
		if (!available('mbstring')) {
			return null;
		}
		const extensions = ['mbstring', 'curl', 'openssl'].filter(available).map((name) => `extension=${name}`);
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'h5ap-i18n-php-'));
		fs.writeFileSync(
			path.join(dir, 'php.ini'),
			[`extension_dir="${extDir.replace(/\\/g, '/')}"`, ...extensions, 'memory_limit=1G', ''].join('\n')
		);
		return dir;
	} catch (e) {
		return null;
	}
}

function localPhpConfigDirs() {
	const runDirs = [
		process.env.APPDATA && path.join(process.env.APPDATA, 'Local', 'run'),
		path.join(os.homedir(), 'Library', 'Application Support', 'Local', 'run'),
		path.join(os.homedir(), '.config', 'Local', 'run'),
	].filter((dir) => dir && fs.existsSync(dir));

	return runDirs.flatMap((runDir) =>
		fs
			.readdirSync(runDir)
			.map((site) => path.join(runDir, site, 'conf', 'php'))
			.filter((dir) => fs.existsSync(path.join(dir, 'php.ini')))
	);
}

const env = { ...process.env };
let tempConfigDir = null;

if (!hasMbstring(env)) {
	tempConfigDir = minimalPhpConfigDir();
	const configDir = [tempConfigDir, ...localPhpConfigDirs()].find(
		(dir) => dir && hasMbstring({ ...env, PHPRC: dir })
	);
	if (!configDir) {
		console.error(
			'\n[i18n] PHP mbstring extension is not available, so WP-CLI cannot extract strings.\n' +
				'       Run the build from Local\'s "Open site shell", or set PHPRC to a folder\n' +
				'       containing a php.ini that enables mbstring.\n'
		);
		if (tempConfigDir) {
			fs.rmSync(tempConfigDir, { recursive: true, force: true });
		}
		process.exit(1);
	}
	env.PHPRC = configDir;
	if (configDir !== tempConfigDir) {
		console.log(`[i18n] Using PHP config from ${configDir}`);
	}
}

// WP-CLI with 1 GB of memory: make-pot parses the large built JS files and runs out with PHP's default 128 MB.
// On Windows `wp` is a .bat that calls `php wp-cli.phar` without settings, so call the phar directly.
function wpCommand() {
	try {
		const found = execSync(process.platform === 'win32' ? 'where wp' : 'command -v wp', {
			env,
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		})
			.split(/\r?\n/)
			.map((line) => line.trim())
			.find(Boolean);
		const phar = /\.(bat|cmd)$/i.test(found) ? path.join(path.dirname(found), 'wp-cli.phar') : found;
		if (phar && fs.existsSync(phar)) {
			return `php -d memory_limit=1G "${phar}"`;
		}
	} catch (e) {
		// fall back to plain `wp`
	}
	return 'wp';
}
const wp = wpCommand();

const run = (command) => execSync(command.replace(/^wp /, `${wp} `), { env, stdio: 'inherit' });

try {
	// bundled/ is gulp's staging copy of the whole plugin; scanning it duplicates every JS translation file.
	run(`wp i18n make-pot . ${args.pot} --exclude=src,bundled,zip`);
	fs.copyFileSync(args.pot, args.po);
	// make-json never deletes JSON for scripts that lost their strings, so start clean each run.
	fs.readdirSync('languages')
		.filter((file) => file.endsWith('.json'))
		.forEach((file) => fs.rmSync(path.join('languages', file)));
	run('wp i18n make-json languages/ --no-purge');
	run('wp i18n make-mo languages/');
	console.log('[i18n] Translation files updated.');
} catch (e) {
	console.error('\n[i18n] WP-CLI failed, translation files were not fully updated (see error above).\n');
	process.exitCode = 1;
} finally {
	if (tempConfigDir) {
		fs.rmSync(tempConfigDir, { recursive: true, force: true });
	}
}
