let camera, scene, renderer, controls;
window.addEventListener("resize", onResize, false);
function onResize(){
    camera.aspect = window.innerWidth / (window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function init(){

    /////////////////swife detector////////////////////////////////////////
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    let xDown = null;                                                        
    let yDown = null;

    function getTouches(evt) {
    return evt.touches ||             
            evt.originalEvent.touches; 
    }                                                     
                                                                            
    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                            
    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        let xUp = evt.touches[0].clientX;                                    
        let yUp = evt.touches[0].clientY;

        let xDiff = xDown - xUp;
        let yDiff = yDown - yUp;
                                                                            
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                console.log("left"); // z-
            } else {
                console.log("right"); // z+
            }                       
        } else {
            if ( yDiff > 0 ) {
                console.log("up"); // x+
            } else { 
                console.log("down "); // x-
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };
    ////////////////////////////////////////////////////////////////


    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(-200,200,50);
    camera.lookAt(scene.position);


    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 70);
    // spotLight.castShadow = true;
    scene.add(spotLight);
    


    let plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100,100,1,1),
        new THREE.MeshLambertMaterial({color: 0xffffff})
        );
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0,0,0);
    // plane.receiveShadow = true;
    scene.add(plane);


    
    const xLength = 5;
    const yLength = 5;
    const zLength = 5;
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(xLength,yLength,zLength),
        new THREE.MeshLambertMaterial({color: 0x00ffff})
    );
    cube.matrixAutoUpdate = false;
    // cube.castShadow = true;
    scene.add(cube);

    let i = 0;
    
    let start = true
    let stepX = 0;
    let stepZ = 0;
    let direction = 0;
    function renderScene(){
        
        camera.lookAt(scene.position);
        if(start){
            i += 0.05;
            if(direction === 0){
                cube.matrix = new THREE.Matrix4().makeTranslation(stepX * xLength,0,yLength/2 + stepZ* zLength).multiply(
                    new THREE.Matrix4().makeRotationX(i).multiply(
                    new THREE.Matrix4().makeTranslation(0,yLength/2, -zLength/2)
                ))
                if (i >= Math.PI/2){
                    start = false
                    stepZ++;
                }
            }
            else if(direction === 1){
                cube.matrix = new THREE.Matrix4().makeTranslation(stepX * xLength,0,-yLength/2 + stepZ* zLength).multiply(
                    new THREE.Matrix4().makeRotationX(-i).multiply(
                    new THREE.Matrix4().makeTranslation(0,yLength/2, zLength/2)
                ))
                if (i >= Math.PI/2){
                    start = false
                    stepZ--;
                }
            }
            else if(direction === 2){
                cube.matrix = new THREE.Matrix4().makeTranslation(xLength/2 + stepX * xLength,0,stepZ* zLength).multiply(
                    new THREE.Matrix4().makeRotationZ(-i).multiply(
                    new THREE.Matrix4().makeTranslation(-xLength/2,yLength/2,0)
                ))
                if (i >= Math.PI/2){
                    start = false
                    stepX++;
                }
            }
            else if(directiion = 3){
                cube.matrix = new THREE.Matrix4().makeTranslation(-xLength/2 + stepX * xLength,0,stepZ* zLength).multiply(
                    new THREE.Matrix4().makeRotationZ(i).multiply(
                    new THREE.Matrix4().makeTranslation(xLength/2,yLength/2,0)
                ))
                if (i >= Math.PI/2){
                    start = false
                    stepX--;
                }                
            }
        }
        else{
            direction = Math.floor(Math.random() * 4);
            i = 0;
            start = true;

        }
        // controls.update();
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    
    //renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    // controls = new THREE.OrbitControls( camera, renderer.domElement );
    renderScene();
}
window.onload = init;