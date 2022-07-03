import * as THREE from 'three'
import './index.css'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'
import gsap from 'gsap'

const scene = new THREE.Scene()
const canvasContainer = document.getElementById('canvasContainer')
const camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth / canvasContainer.offsetHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.getElementById('canvas')
})

renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),

  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load('./assets/globe.jpg')
      }
    }
  })
)
//create atmosphere
scene.add(sphere)

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),

  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)
atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere)

const mouse = {
  x: undefined,
  y: undefined
}
const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})

const starVertices = []
for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000
  const z = -(Math.random() - 0.5) * 2000
  starVertices.push(x, y, z)
}
starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starVertices, 3)
)
const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)
camera.position.z = 15

function animate () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  sphere.rotation.y += 0.002
  gsap.to(group.rotation, {
    x: -mouse.y * 0.5,
    y: mouse.x * 0.5,
    duration: 2
  })
}

animate()

addEventListener('mousemove', () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})
