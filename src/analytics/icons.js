// Small inline icons, kept local so the page never loads anything from another server.
const svg = (children, viewBox = '0 0 24 24') => (
	<svg viewBox={viewBox} width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
		{children}
	</svg>
);

export const logo = (
	<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false">
		<rect width="40" height="40" rx="9" fill="#04a504" />
		<path d="M7 21h6l3-7 5 13 4-10 2 4h6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

export const play = svg(<path d="M7 4.5v15l12-7.5z" />);
export const clock = svg(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const average = svg(<><path d="M10 2h4" /><path d="m12 14 3-3" /><circle cx="12" cy="14" r="8" /></>);
export const finish = svg(<><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>);
export const lock = svg(<><rect x="5" y="11" width="14" height="10" rx="1" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>);
export const shield = svg(<><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" /><path d="m9 12 2 2 4-4" /></>);
export const warning = svg(<><path d="M12 4 2.5 20h19z" /><path d="M12 10v4M12 17.5v.01" /></>);
export const back = svg(<path d="M19 12H5m6-6-6 6 6 6" />);
export const arrow = svg(<path d="M5 12h14m-6-6 6 6-6 6" />);
export const trash = svg(<><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 13h10l1-13M9 7V4h6v3" /></>);
export const music = svg(<><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>);
export const radio = svg(<><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5" /></>);
export const crown = svg(<path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5z" />);
