let camera, scene, renderer, controls;
window.addEventListener("resize", onResize, false);
function onResize(){
    camera.aspect = window.innerWidth / (window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function init(){
    const scoreBoard = document.querySelector("#score");
    /////////////////swife detector////////////////////////////////////////
    let curr_direction = 0
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
                curr_direction = 3;
            } else {
                curr_direction = 2;
            }                       
        } else {
            if ( yDiff > 0 ) {
                curr_direction = 0;
            } else { 
                curr_direction = 1;
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };
    ////////////////////////////////////////////////////////////////


    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(-60,60,25);
    camera.lookAt(scene.position);


    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 70);
    // spotLight.castShadow = true;
    scene.add(spotLight);
    

    const planeLen = 29
    let plane = new THREE.Mesh(

        new THREE.PlaneGeometry(planeLen,planeLen,1,1),
        new THREE.MeshBasicMaterial({color: 0x777777})
        );
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0,0,0);
    // plane.receiveShadow = true;
    scene.add(plane);


    
    let boxLenX = 1;
    let boxLenY = 1;
    let boxLenZ = 1;
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(boxLenX,boxLenY,boxLenZ),
        new THREE.MeshLambertMaterial({color: 0x00ffff})
    );
    cube.matrixAutoUpdate = false;
    // cube.castShadow = true;
    scene.add(cube);

    const radius = 0.45;
    let apple = new THREE.Mesh(
        new THREE.PlaneGeometry( radius * 2, radius * 2, 1,1), 
        new THREE.MeshBasicMaterial( { color: 0xffff00 } )
    )
    apple.matrixAutoUpdate = false;
    function rangeRandom(){
        return Math.floor(Math.random() * planeLen) - (planeLen - 1)/2;
    }
    let appleCoordinate = {x:rangeRandom(), z:rangeRandom()};
    apple.matrix = new THREE.Matrix4().makeTranslation(appleCoordinate.x,0.1,appleCoordinate.z).multiply(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    scene.add(apple)

    let i = 0;
    let j = 0;
    let score = 0;
    let increment = 1;
    let start = true
    let worldLen = {x : boxLenX, y : boxLenY, z : boxLenZ}
    let coordinate = {x : 0, z : 0};
    let worldToLocal = {x : 0, y : 1, z : 2};
    let direction = 0;
    let staticMatrix = new THREE.Matrix4();
    function renderScene(){
        
        camera.lookAt(scene.position);
        if(start){
            i += 0.05;
            //x+
            
            if(direction === 0){
                cube.matrix = new THREE.Matrix4().makeTranslation(worldLen.x/2 + coordinate.x,0,coordinate.z).multiply(
                    new THREE.Matrix4().makeRotationZ(-i).multiply(
                    new THREE.Matrix4().makeTranslation(-worldLen.x/2,worldLen.y/2,0).multiply(
                        staticMatrix
                    )))
                if (i >= Math.PI/2){
                    start = false
                    coordinate.x += worldLen.x/2 + worldLen.y/2;
                    staticMatrix = new THREE.Matrix4().makeRotationZ(Math.PI / 2).multiply(staticMatrix);
                    [worldLen.x, worldLen.y] = [worldLen.y, worldLen.x];
                    [worldToLocal.x, worldToLocal.y] = [worldToLocal.y, worldToLocal.x];
                }
            }            
            //x-
            else if(direction === 1){
                cube.matrix = new THREE.Matrix4().makeTranslation(-worldLen.x/2 + coordinate.x,0,coordinate.z).multiply(
                    new THREE.Matrix4().makeRotationZ(i).multiply(
                    new THREE.Matrix4().makeTranslation(worldLen.x/2,worldLen.y/2,0).multiply(
                        staticMatrix
                    )))
                if (i >= Math.PI/2){
                    start = false
                    coordinate.x -= worldLen.x/2 + worldLen.y/2;
                    staticMatrix = new THREE.Matrix4().makeRotationZ(Math.PI / 2).multiply(staticMatrix);
                    [worldLen.x, worldLen.y] = [worldLen.y, worldLen.x];
                    [worldToLocal.x, worldToLocal.y] = [worldToLocal.y, worldToLocal.x];
                }                
            }            
            //z+
            else if(direction === 2){
                cube.matrix = new THREE.Matrix4().makeTranslation(coordinate.x,0,worldLen.z/2 + coordinate.z).multiply(
                    new THREE.Matrix4().makeRotationX(i).multiply(
                    new THREE.Matrix4().makeTranslation(0,worldLen.y/2, -worldLen.z/2).multiply(
                        staticMatrix
                    )))
                if (i >= Math.PI/2){
                    start = false
                    coordinate.z += worldLen.z/2 + worldLen.y/2;
                    staticMatrix = new THREE.Matrix4().makeRotationX(Math.PI / 2).multiply(staticMatrix);
                    [worldLen.z, worldLen.y] = [worldLen.y, worldLen.z];
                    [worldToLocal.z, worldToLocal.y] = [worldToLocal.y, worldToLocal.z];
                }
            }
            //z-
            else if(direction === 3){
                cube.matrix = new THREE.Matrix4().makeTranslation(coordinate.x,0,-worldLen.z/2 + coordinate.z).multiply(
                    new THREE.Matrix4().makeRotationX(-i).multiply(
                    new THREE.Matrix4().makeTranslation(0,worldLen.y/2, worldLen.z/2).multiply(
                        staticMatrix
                    )))
                if (i >= Math.PI/2){
                    start = false
                    coordinate.z -= worldLen.z/2 + worldLen.y/2;
                    staticMatrix = new THREE.Matrix4().makeRotationX(Math.PI / 2).multiply(staticMatrix);
                    [worldLen.z, worldLen.y] = [worldLen.y, worldLen.z];
                    [worldToLocal.z, worldToLocal.y] = [worldToLocal.y, worldToLocal.z];
                }
            }


            
        }
        else{
            
            direction = curr_direction;
            i = 0
            if(Math.abs(coordinate.x*2) - worldLen.x > planeLen-1 || Math.abs(coordinate.z*2) - worldLen.z > planeLen-1){
                j += 0.5;
                cube.matrix = new THREE.Matrix4().makeTranslation(coordinate.x,worldLen.y/2 - j,coordinate.z).multiply(staticMatrix)
                if (j > 60){
                    console.log(1);
                }
            }
            else if(Math.abs(appleCoordinate.x - coordinate.x) < radius + worldLen.x/2 && Math.abs(appleCoordinate.z - coordinate.z) < radius + worldLen.z/2){
                j+= 0.1;
                cube.matrix = new THREE.Matrix4().makeTranslation(coordinate.x,(worldLen.y + j) / 2,coordinate.z).multiply(
                    new THREE.Matrix4().makeScale(1,(worldLen.y + j)/worldLen.y,1).multiply(staticMatrix)
                )
                if (j>increment){
                    j =0;
                    start = true;
                    staticMatrix = new THREE.Matrix4().makeScale(1,(worldLen.y + increment)/worldLen.y,1).multiply(staticMatrix);
                    worldLen.y += increment
                    appleCoordinate = {x:rangeRandom(), z:rangeRandom()};
                    
                    apple.matrix = new THREE.Matrix4().makeTranslation(appleCoordinate.x,0.1,appleCoordinate.z).multiply(new THREE.Matrix4().makeRotationX(- Math.PI/2));
                    score++
                    console.log(score)
                    scoreBoard.innerHTML = `score : ${score}`
                }

            }
            else{
                start = true;

            }
            }
        // controls.update();
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    
    //renderer
    renderer = new THREE.WebGLRenderer( {antialias : true} );
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    // controls = new THREE.OrbitControls( camera, renderer.domElement );
    renderScene();
}
window.onload = init;

//작아지는 거
