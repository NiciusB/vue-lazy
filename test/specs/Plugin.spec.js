import { createVM } from '../helpers/utils.js'

describe('Basic', function () {
  it('v-lazy shouldn\'t crash', function () {
    const src = 'https://via.placeholder.com/150'
    const vm = createVM(this, `<img v-lazy="'${src}'">`)
    const elm = vm.$el.querySelector('img')

    elm.src.should.eql('')
  })

  it('v-lazy should load images', function (done) {
    const src = 'https://via.placeholder.com/150'
    const vm = createVM(this, `<img v-lazy="'${src}'">`)
    const elm = vm.$el.querySelector('img')
    setTimeout(() => {
      elm.src.should.eql(src)
      done()
    }, 1000)
  })
})
