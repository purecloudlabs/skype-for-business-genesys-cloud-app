import MarkdownIt from 'markdown-it';

const md = new MarkdownIt('zero', {
    linkify: true
}).enable('linkify');

const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const targetIndex = token.attrIndex('href');
    if (targetIndex !== -1) {
        let href = token.attrGet('href');
        token.attrPush(['target', '_blank']);
        token.attrPush(['rel', 'noopener noreferrer']);

        const pattern = /:\/\//i;
        if (!pattern.test(href)) {
            token.attrSet('href', `http://${href}`);
        }
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
};

export function render(str) {
    return md.renderInline(str);
}

export default md;
