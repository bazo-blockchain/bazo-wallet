import Vue from 'vue';
import jsdom from 'jsdom';
import App from '../src/App.vue';
const renderer = require('vue-server-renderer').createRenderer();
describe('Test suite for App', () => {
  it('Test data msg', () => {
    const ClonedComponent = Vue.extend(Hello);
    const NewComponent = new ClonedComponent({
      data() {
        return {
          showHeader: true,
        };
      },
    }).$mount();
    renderer.renderToString(NewComponent, (err, str) => {
      const dom = new jsdom.JSDOM(str);
      const sidebar = dom.window.document.querySelector('header-bar');
      console.log(sidebar);
      expect(sidebar.textContent).toContain('I am a cool message');
    });
  });
});
