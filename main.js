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
    const yLength = 10;
    const zLength = 15;
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(xLength,yLength,zLength),
        new THREE.MeshLambertMaterial({color: 0x00ffff})
    );
    cube.matrixAutoUpdate = false;
    // cube.castShadow = true;
    scene.add(cube);

    let i = 0;
    
    let start = true
    let stepX = 0, stepZ = 0;
    let worldX = xLength, worldY = yLength, worldZ = zLength;
    let coordinate = {x : 0, z : 0};
    let direction = 0;
    let staticMatrix = new THREE.Matrix4();
    function renderScene(){
        
        camera.lookAt(scene.position);
        if(start){
            i += 0.05;
            //z+
            if(direction === 0 ){
                cube.matrix = new THREE.Matrix4().makeTranslation(coordinate.x,0,worldZ/2 + coordinate.z).multiply(
                    new THREE.Matrix4().makeRotationX(i).multiply(
                    new THREE.Matrix4().makeTranslation(0,worldY/2, -worldZ/2).multiply(
                        staticMatrix
                    )))
                if (i >= Math.PI/2){
                    start = false
                    coordinate.z += worldZ/2 + worldY/2;
                    staticMatrix = new THREE.Matrix4().makeRotationX(Math.PI / 2).multiply(staticMatrix);
                    [worldZ, worldY] = [worldY, worldZ];
                }
            }
            //z-
            else if(direction === 1){
                cube.matrix = new THREE.Matrix4().makeTranslation(coordinate.x,0,-worldZ/2 + coordinate.z).multiply(
                    new THREE.Matrix4().makeRotationX(-i).multiply(
                    new THREE.Matrix4().makeTranslation(0,worldY/2, worldZ/2).multiply(
                        staticMatrix
                    )))
                if (i >= Math.PI/2){
                    start = false
                    coordinate.z -= worldZ/2 + worldY/2;
                    staticMatrix = new THREE.Matrix4().makeRotationX(Math.PI / 2).multiply(staticMatrix);
                    [worldZ, worldY] = [worldY, worldZ];
                }
            }
            //x+
            else if(direction === 2){
                cube.matrix = new THREE.Matrix4().makeTranslation(worldX/2 + coordinate.x,0,coordinate.z).multiply(
                    new THREE.Matrix4().makeRotationZ(-i).multiply(
                    new THREE.Matrix4().makeTranslation(-worldX/2,worldY/2,0).multiply(
                        staticMatrix
                    )))
                if (i >= Math.PI/2){
                    start = false
                    coordinate.x += worldX/2 + worldY/2;
                    staticMatrix = new THREE.Matrix4().makeRotationZ(Math.PI / 2).multiply(staticMatrix);
                    [worldX, worldY] = [worldY, worldX];
                }
            }
            //x-
            else if(directiion = 3){
                cube.matrix = new THREE.Matrix4().makeTranslation(-worldX/2 + coordinate.x,0,coordinate.z).multiply(
                    new THREE.Matrix4().makeRotationZ(i).multiply(
                    new THREE.Matrix4().makeTranslation(worldX/2,worldY/2,0).multiply(
                        staticMatrix
                    )))
                if (i >= Math.PI/2){
                    start = false
                    coordinate.x -= worldX/2 + worldY/2;
                    staticMatrix = new THREE.Matrix4().makeRotationZ(Math.PI / 2).multiply(staticMatrix);
                    [worldX, worldY] = [worldY, worldX];
                }                
            }
            
        }
        else{
            direction = Math.floor(Math.random() * 4);
            i = 0;
            start = true;
            
            console.log(coordinate)
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