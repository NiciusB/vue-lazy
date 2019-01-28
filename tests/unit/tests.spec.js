import { createLocalVue, mount } from '@vue/test-utils'
import VueLazy from '../../dist/VueLazy.umd'
import SimpleImage from './SimpleImage.vue'
import BgImage from './BgImage.vue'
import { transparentPixel } from '../../src/utils'

const IMAGE_SRC_FAILURE = 'img_failure'
const IMAGE_SRC_SUCCESS = 'img_success'

beforeAll(() => {
  Object.defineProperty(global.Image.prototype, 'src', {
    get () {
      return this.__src || ''
    },
    set (src) {
      this.__src = src
      if (src === IMAGE_SRC_FAILURE) {
        setTimeout(() => this.onerror(new Error('mocked error')))
      } else if (src === IMAGE_SRC_SUCCESS) {
        setTimeout(() => this.onload())
      } else {
        throw new Error('src was neither IMAGE_SRC_FAILURE or IMAGE_SRC_SUCCESS')
      }
    }
  })
})

function fireScroll (wrapper) {
  wrapper.element.getBoundingClientRect = () => ({
    width: 100,
    height: 100,
    top: -50,
    left: -50,
    right: 50,
    bottom: 50
  })
  wrapper.element.dispatchEvent(new Event('scroll'))
  return new Promise(resolve => setTimeout(resolve, 250))
}

// create an extended `Vue` constructor
const localVue = createLocalVue()
// install plugins as normal
localVue.use(VueLazy)

describe('SimpleImage.vue', () => {
  it('Directive exists and initializes with empty gif', () => {
    const wrapper = mount(SimpleImage, {
      localVue,
      propsData: { src: IMAGE_SRC_FAILURE }
    })
    expect(wrapper.html()).toBe(`<img src="${transparentPixel}">`)
  })

  it('Image loads', async () => {
    const wrapper = mount(SimpleImage, {
      localVue,
      propsData: { src: IMAGE_SRC_SUCCESS }
    })
    await fireScroll(wrapper)
    expect(wrapper.html()).toBe(`<img src="${IMAGE_SRC_SUCCESS}">`)
  }, 1000)

  it('Image fails to load', async () => {
    const wrapper = mount(SimpleImage, {
      localVue,
      propsData: { src: IMAGE_SRC_FAILURE }
    })
    await fireScroll(wrapper)
    expect(wrapper.html()).toBe(`<img src="${transparentPixel}">`)
  }, 1000)

  it('Other bind types work', async () => {
    const wrapper = mount(BgImage, {
      localVue,
      propsData: { src: IMAGE_SRC_SUCCESS }
    })
    await fireScroll(wrapper)
    expect(wrapper.html()).toBe(`<img style="background-image: url(${IMAGE_SRC_SUCCESS});">`)
  }, 1000)
})
