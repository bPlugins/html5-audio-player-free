import { __ } from '@wordpress/i18n';

const NewBadge = () => (
    <span
        style={{
            background: 'linear-gradient(135deg, #146EF5, #3b82f6)',
            color: '#fff',
            fontSize: '9px',
            fontWeight: 'bold',
            padding: '3px 6px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginLeft: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: '1',
            verticalAlign: 'middle',
            boxShadow: '0 1px 2px rgba(20, 110, 245, 0.2)'
        }}
    >
        {__("New", 'html5-audio-player')}
    </span>
);

export default NewBadge;
