import './style.css'
import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Scene } from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

//scene creation
const scene= new THREE.Scene()  

/**cube
const geomatry= new THREE.BoxBufferGeometry(1, 1, 1) //dit is de vorm
const material = new THREE.MeshBasicMaterial({color: 0xff0000 })  //dit is het materiaal
const cube = new THREE.Mesh(geomatry, material) //samen maken ze een mesh
scene.add(cube)
*/

//light
var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
directionalLight.position.set(3, 3, 3);
directionalLight.castShadow = true;
scene.add(directionalLight)

const light = new THREE.AmbientLight( 0x404040,1.2 ); // soft white light
scene.add( light );

//windowsize
const size = {width: window.innerWidth, height:window.innerHeight}


window.addEventListener("resize", () =>
{
    size.width= window.innerWidth
    size.height= window.innerHeight

    cam.aspect = size.width/ size.height
    cam.updateProjectionMatrix()

    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


//texture loaders
const textureLoader= new THREE.TextureLoader()
const starTexture= textureLoader.load('/startexture.png')

let scrollY = window.scrollY / size.height

window.addEventListener("scroll", () =>{
    scrollY=window.scrollY /size.height
    console.log(scrollY)
})

// gltf loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader =new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    'earth.glb',
    (gltf) =>
    {
        console.log(gltf)
        scene.add(gltf.scene)
        gltf.scene.position.set(0,0,0)
        gltf.scene.rotation.set(Math.PI*0.1,Math.PI*-0.3,Math.PI*0.03)
        gltf.scene.scale.set(1.5,1.5,1.5)

        const expantion= 0.75
        const rotationUntilAfrica= expantion + 0.69
        const AfricaUp= rotationUntilAfrica+ 0.3
        const AfricaDown=  AfricaUp+ 0.7
        const rotationUntilEurope= AfricaDown
        const EuropeUp= rotationUntilEurope+ 0.3
        const EuropeDown=  EuropeUp+ 0.7
        const rotationUntilAsia= EuropeDown

        const afrika = gltf.scene.getObjectByName("afrika", true)
        const europe = gltf.scene.getObjectByName("europe", true)
    

        function tick(){
            if(scrollY<expantion){ //Epansion of earth
                gltf.scene.position.set(0,0,(scrollY-expantion)*expantion*29.33)
            }
            if(scrollY<rotationUntilAfrica){ //rotatioin of earth until it reaches Africa.
                gltf.scene.rotation.set(0,Math.PI-scrollY*Math.PI,0)
            }
            
            if(scrollY>rotationUntilAfrica  && scrollY<AfricaUp ){
                afrika.scale.set(1+ (scrollY-rotationUntilAfrica) * 0.08/(AfricaUp-rotationUntilAfrica),1+ (scrollY-rotationUntilAfrica) * 0.08/(AfricaUp-rotationUntilAfrica)
                ,1+ (scrollY-rotationUntilAfrica) * 0.08/(AfricaUp-rotationUntilAfrica));
                
            }
            /*
            if(scrollY>AfricaUp  && scrollY<AfricaDown ){
                //afrika.scale.set(1.08- (scrollY-AfricaUp) * 0.08/(AfricaDown-AfricaUp),1.08- (scrollY-AfricaUp) * 0.08/(AfricaDown-AfricaUp)
                //,1.08- (scrollY-AfricaUp) * 0.08/(AfricaDown-AfricaUp));
            }
            */
            if(scrollY>AfricaUp && scrollY<rotationUntilEurope){
                gltf.scene.rotation.x=(Math.PI*(scrollY-AfricaUp) * 0.3/(rotationUntilEurope-AfricaUp)) 
            }

            if(scrollY>rotationUntilEurope  && scrollY<EuropeUp ){
                europe.scale.set(1+ (scrollY-rotationUntilEurope) * 0.08/(EuropeUp-rotationUntilEurope),1+ (scrollY-rotationUntilEurope) * 0.08/(EuropeUp-rotationUntilEurope)
                ,1+ (scrollY-rotationUntilEurope) * 0.08/(EuropeUp-rotationUntilEurope));
                
            }
            /*
            if(scrollY>EuropeUp  && scrollY<EuropeDown ){
                //europe.scale.set(1.08- (scrollY-EuropeUp) * 0.08/(EuropeDown-EuropeUp),1.08- (scrollY-EuropeUp) * 0.08/(EuropeDown-EuropeUp)
                //,1.08- (scrollY-EuropeUp) * 0.08/(EuropeDown-EuropeUp));
            }
            */
            
            
            
            

            window.requestAnimationFrame(tick)
        }

        tick()
    }

)

//stars
const starMaterial= new THREE.PointsMaterial()
starMaterial.size=15
starMaterial.sizeAttenuation=false
starMaterial.transparent=true
starMaterial.alphaMap= starTexture
starMaterial.depthWrite=true
const starGeometry= new THREE.BufferGeometry

const total= 500;
const positionArray= new Float32Array(total*3)

for(let i=0;i<positionArray.length;i++){
    positionArray[i]= (Math.random() -0.5 ) *300
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray,3))
const starPoints= new THREE.Points(starGeometry, starMaterial)
scene.add(starPoints)


//camera
const cam = new THREE.PerspectiveCamera(75, size.width/size.height, 0.5, 200) 
cam.position.set(0,0,5)

scene.add(cam)


//canvas
const canvas= document.querySelector(".webgl") //je renderer moet worden gedisplayed op een canvas. EEn canvas maak je in de html en hier geef je aan welke canvas de renderer moet gebruiken.
const renderer= new THREE.WebGLRenderer({
    canvas: canvas
})

//controls
/*
const controls = new OrbitControls(cam, canvas)
controls.enableDamping= true
controls.target.y=0
controls.update
*/


//renderer
renderer.setSize(size.width, size.height) // je renderer heeft ook een bepaalde grootte
renderer.render(scene, cam) 

//animations
const clock = new THREE.Clock

function tick()
{
    const elapsedTime = clock.getElapsedTime()
    //controls.update()
    renderer.render(scene, cam) 
    window.requestAnimationFrame(tick)
}

tick()