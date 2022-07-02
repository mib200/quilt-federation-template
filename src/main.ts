import { render, createElement } from 'preact';

import App from "./App";

const loadApp = (
    id: string
) => {
    const root = document.getElementById(id);
    if (root) {
        render(createElement(App, {}), root)
    }
}

export default loadApp