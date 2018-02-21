//Variables globales
var tabla_jugador=[];
var tabla_maquina=[];
var tiradas_jugador=[];
var tiradas_maquina=[];
var arr_text=[];
var partida_activa=true;
var barcos_hundidos=0;
var barcos_hundidos_pc=0;
var tiradas=0;
var nombre="";
var array_puntu=[];
var num_hint= 0;
//LocalStorage, puntuaciones  records
function sortFunction(b, a) { //Ordenamos tabla de puntuaciones de menor a mayor
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}
function recoger_puntu() {
    var puntuaciones = localStorage.getItem('puntuaciones');

    if (puntuaciones!=null) {
        puntu2=JSON.parse(puntuaciones);
        var tam=puntu2.length;
        var aux=[nombre,tiradas];
        puntu2.push(aux);
        localStorage.setItem('puntuaciones', JSON.stringify(puntu2));
    }
    else {
        var puntuaciones=[];
        var aux=[nombre,tiradas];
        puntuaciones.push(aux);
        localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));
    }
    init_puntu();
}
function init_puntu() {    
    //localStorage.clear(); //Con esto limpiamos el localstorage
    ctx.clearRect(420, 345, 220,200);
    var puntuaciones = localStorage.getItem('puntuaciones');
    if (puntuaciones!=null) {
        //puntuaciones.sort(sortFunction);
        ctx.font="bold 18px arial";
        var verti=405;
        console.log(puntuaciones);
        puntu1=JSON.parse(puntuaciones);
        puntu1.sort(sortFunction);
        for (i=0;i<puntu1.length;i++) {
            if (i<6) {
                ctx.fillText(puntu1[i][0],430,verti-30);
                ctx.fillText(puntu1[i][1],570,verti-30);
                verti+=30;
            }
        }
    }
}
//Chivato para ver como se representa la matriz
function chivato(vector){
    var myDiv=document.getElementById("myDiv");
    var x="";
    for (var i=0;i<10;i++){
        for (var j=0;j<10;j++){
            x=x+" "+vector[i][j];
        }
        x=x+"<br />";
    }
    myDiv.innerHTML=x;
}
//Llenamos la tabla de 0
function tablas_a_0() {
    for (var i=0;i<10;i++) {
        var aux=[];
        var aux2=[];
        for (var j=0;j<10;j++) {
            aux.push(0);
            aux2.push(0);
        }
        tabla_jugador.push(aux);
        tabla_maquina.push(aux2);
    }
}
//funcion HINT
function hint() {
    if (num_hint<3) {
        var linea_pista=Math.floor(Math.random()*10); 
        var i=0;
        console.log(barcos_hundidos);
        while (true) {
            if (partida_activa==false) {
                break;
            }
            if (tabla_jugador[linea_pista][i]!=0 && tabla_jugador[linea_pista][i]<42.5) {
                tirar_pintar_usuario(linea_pista,i);
                num_hint++;
                tiradas+=5;
                break;
            } else {
                i++;
            }
            if (i==10) {
                hint();
                break;
            }
        }
    }
    else {
        alert("Ya has usado 3 pistas!");
    }
}
//Dibujamos las cuadriculas
function dibujarCuadros(x) {
    for (var i=0;i<300;i=i+30){
        for (var j=0;j<300;j=j+30) {
            ctx.strokeRect(x+i,0+j,30,30);
        }
    }
}
//Funcion de tirada de usuario y pintar en tablero
function tirar_pintar_usuario(x,y) {
    if (partida_activa==true) {
        var inicioX=x*30;
        var inicioY=y*30;
        if (tabla_jugador[x][y]==0) {
            var img=document.getElementById("myImage");
            ctx.drawImage(img, inicioY+2, inicioX+2);
            tabla_jugador[x][y]+=42.5;
            tirar_pintar_maquina();
            dibujar_accion("Agua!",0);
        }
        else if (tabla_jugador[x][y]<42) {
            var numb=tabla_jugador[x][y];
            var img=document.getElementById("myImagetocado");
            ctx.drawImage(img, inicioY+2, inicioX+2);
            tabla_jugador[x][y]+=42.5;
            var cont=0;
            for (var i=0;i<=9;i++) {
                for (var j=0;j<=9;j++) {
                    if (tabla_jugador[i][j]==numb) {
                        cont++;
                    }
                }
            }
            if (cont==0) {
                for (var i=0;i<=9;i++) {
                    for (var j=0;j<=9;j++) {
                        if (tabla_jugador[i][j]==numb+42.5) {
                            var inicioX=i*30;
                            var inicioY=j*30;
                            ctx.clearRect(inicioY+2, inicioX+2, 27, 27);
                            var img=document.getElementById("myImagehundido");
                            ctx.drawImage(img, inicioY+2, inicioX+2);
                        }
                    }
                }
                dibujar_accion("Has hundido un barco!",1);
            }
            else {
                dibujar_accion("Has tocado un barco!",0);
            }
            //dibujar_accion("holasa");
            tirar_pintar_maquina();
        }
        else {
            dibujar_accion("Ya has disparado en esta posicion!",0);
        }
        tiradas++;
        //console.log(barcos_hundidos);
        if (barcos_hundidos==10) {
            partida_activa=false;
            dibujar_accion("Enhorabuena, Has ganado!",true);
            recoger_puntu();
        }
    }
}
//Funcion de tirada de maquina  pintar en tablero
function tirar_pintar_maquina() {
    var y=Math.floor(Math.random()*10);
    var x=Math.floor(Math.random()*10);
    var everytest = tiradas_maquina.every(function(item,index,array){
        return (item!=(x+";"+y));
    });
    if (everytest==true) {
        var inicioX=x*30;
        var inicioY=y*30;
        if (tabla_maquina[x][y]==0) {
            var img=document.getElementById("myImage");
            ctx.drawImage(img, inicioY+332, inicioX+1);
            tabla_maquina[x][y]+=42.5;
        }
        else if (tabla_maquina[x][y]<42) {
            var numb=tabla_maquina[x][y];
            var img=document.getElementById("myImagetocado");
            ctx.drawImage(img, inicioY+332, inicioX+1);
            tabla_maquina[x][y]+=42.5;
            var cont=0;
            for (var i=0;i<=9;i++) {
                for (var j=0;j<=9;j++) {
                    if (tabla_maquina[i][j]==numb) {
                        cont++;
                    }
                }
            }
            if (cont==0) {
                for (var i=0;i<=9;i++) {
                    for (var j=0;j<=9;j++) {
                        if (tabla_maquina[i][j]==numb+42.5) {
                            var inicioX=i*30;
                            var inicioY=j*30;
                            ctx.clearRect(inicioY+332, inicioX+2, 27, 27);
                            var img=document.getElementById("myImagehundido");
                            ctx.drawImage(img, inicioY+332, inicioX+1);
                            barcos_hundidos_pc+=1;
                            console.log(barcos_hundidos_pc);
                            if (barcos_hundidos_pc==20) {
                                partida_activa=false;
                                ctx.clearRect(1, 346, 398,198);
                                dibujar_accion("GAME OVER!",true);
                            }
                        }
                    }
                }
            }
        }
        tiradas_maquina.push(x+";"+y);
    }
    else {
        //console.log(x+";"+y);
        tirar_pintar_maquina();
    }
}
//Dibujamos los botones
function botones() {
    document.write("<div class='butt'>");
    for (var i=0;i<10;i++) {
        for (var j=0;j<10;j++) {
            document.write("<button onclick='tirar_pintar_usuario("+i+","+j+")'></button>");
        }
        document.write("<br>");
    }
    document.write("</div>");
}
//Grupo de funciones para rodear las naves de 9 para que tenga un borde y otras naves no puedan ponerse alli, posteriormente se borraran
function pintar_9_horiz_arriba_abajo(y,x,i,tabla) {
    if (y+1!=10) {
        tabla[y+1][x+i]=9; 
    }
    if (y-1!=-1) {
        tabla[y-1][x+i]=9;
    }
}
function pintar_9_vert_lados(y,x,i,tabla) {
    if (x+1!=10) {
        tabla[y+i][x+1]=9; 
    }
    if (x-1!=-1) {
        tabla[y+i][x-1]=9;
    }
}
function pintar_9_horiz_lados_y_esquinas(y,x,tam,tabla) {
    if (x-1!=-1) {
        tabla[y][x-1]=9;
        if (y-1!=-1) {
            tabla[y-1][x-1]=9;
        }
        if (y+1!=10) {
            tabla[y+1][x-1]=9;
        }
    }
    if (x+tam!=10) {
        tabla[y][x+tam]=9;
        if (y-1!=-1) {
            tabla[y-1][x+tam]=9;
        }
        if (y+1!=10) {
            tabla[y+1][x+tam]=9;
        }
    }
}
function pintar_9_vert_arriba_abajo_y_esquinas(y,x,tam,tabla) {
    if (y-1!=-1) {
        tabla[y-1][x]=9;
        if (x-1!=-1) {
            tabla[y-1][x-1]=9;
        }
        if (x+1!=10) {
            tabla[y-1][x+1]=9;
        }
    }
    if (y+tam!=10) {
        tabla[y+tam][x]=9;
        if (x+1!=10) {
            tabla[y+tam][x+1]=9;
        }
        if (x-1!=-1) {
            tabla[y+tam][x-1]=9;
        }
    }
}
function borrar_9(tabla) {
    for (var i=0;i<10;i++) {
        for (var j=0;j<10;j++) {
            if (tabla[i][j]==9) {
                tabla[i][j]=0;
            }
        }
    }
    return tabla;
}
//colocaremos los barcos
function colocar_barco(cod,tam,tabla) {
    var y=Math.floor(Math.random()*10);
    var x=Math.floor(Math.random()*10);
    var orientacion=Math.floor(Math.random()*2);
    if (orientacion==0) {
        if (x+tam-1<=9) {
            var test=tabla[y].slice(x,x+tam);
            var everytest = test.every(function(item,index,array){
                return (item==0);
            });
            //console.log(test);
            if (everytest==true) {
                for (var i=0;i<tam;i++) {
                    tabla[y][x+i]=cod;
                    pintar_9_horiz_arriba_abajo(y,x,i,tabla);
                }
                pintar_9_horiz_lados_y_esquinas(y,x,tam,tabla);
            }
            else {
                colocar_barco(cod,tam,tabla);
            }
        }
        else {
            colocar_barco(cod,tam,tabla);
        }
    }
    else {
        if (y+tam-1<=9) {
           var test=[];
            for (var i=y;i<=y+(tam-1);i++) {
                test.push(tabla[i][x]);
            }
            var everytest = test.every(function(item,index,array){
                return (item==0);
            });
            if (everytest==true) {
                for (i=0;i<tam;i++) {
                    tabla[y+i][x]=cod;
                    pintar_9_vert_lados(y,x,i,tabla);
                }
                pintar_9_vert_arriba_abajo_y_esquinas(y,x,tam,tabla);
            }
            else {
                colocar_barco(cod,tam,tabla);
            }
        }
        else {
            colocar_barco(cod,tam,tabla);
        }
    }
    //console.log("y: "+y+" x: "+x);
}
//dibujar naves
function dibujar_naves_maquina() {
    for (var i=0;i<10;i++) {
        for (var j=0;j<10;j++) {
            if (tabla_maquina[i][j]!=0) {
                var inicioX=j*30;
                var inicioY=i*30;
                var img=document.getElementById("myImageBarco");
                ctx.drawImage(img, inicioX+332, 1+inicioY);
                //ctx.strokeRect(335+(j*30),5+(i*30),20,20);
            }
        }
    }
}
function dibujar_naves_jugador() {
    for (var i=0;i<10;i++) {
        for (var j=0;j<10;j++) {
            if (tabla_jugador[i][j]==1) {
                ctx.strokeRect(5+(j*30),5+(i*30),20,20);
            }
        }
    }
}
//Generamos las naves que tendremos en una matriz (de forma aleatoria)
function generar_naves(tabla) {
    colocar_barco(1,4,tabla);
    colocar_barco(2,3,tabla);
    colocar_barco(3,3,tabla);
    colocar_barco(4,2,tabla);
    colocar_barco(5,2,tabla);
    colocar_barco(6,2,tabla);
    colocar_barco(8,1,tabla);
    colocar_barco(10,1,tabla);
    colocar_barco(11,1,tabla);
    colocar_barco(12,1,tabla);
    borrar_9(tabla);
}
//FUNCIONES DEL PANEL
function dibujar_panel() {
    ctx.strokeRect(0,345,400,200);
    ctx.font="bold 25px arial";
    ctx.fillText("Panel",0,339);
}
function dibujar_panel_record() {
    ctx.strokeRect(420,345,220,200);
    ctx.font="bold 25px arial";
    ctx.fillText("Top Score",470,339);
}
function pregunta_nombre() {
    while (true) {
        nombre=prompt("Introduce tu nombre para comenzar: ");
        if (nombre!=null && nombre!="") {
            break;
        }
    }
}
function dibujar_accion(accion,num) {
    barcos_hundidos=barcos_hundidos+parseInt(num);
    ctx.font="bold 18px arial";
    text="["+mostrarhora()+"] "+accion
    arr_text.push(text);
    var verti=565;
    //console.log(arr_text);
    //console.log(arr_text.length);
    ctx.clearRect(1, 346, 398,198);
    var pan_num=0;
        for (var i=arr_text.length-1;i>=0;i--) {
            //console.log(arr_text[i]);
            ctx.fillText(arr_text[i],5,verti-30);
            verti-=30;
            pan_num++;
            if (pan_num==6) {
                break;
            }
        }
}
//funcion para mostrar la hora
function mostrarhora(){
    var hora=new Date();
    if (hora.getMinutes()<10) {
        if (hora.getSeconds()<10) {
            cad=hora.getHours()+":"+"0"+hora.getMinutes()+":0"+hora.getSeconds();
        }
        else {
            cad=hora.getHours()+":"+"0"+hora.getMinutes()+":"+hora.getSeconds();
        }
    }
    else {
        if (hora.getSeconds()<10) {
            cad=hora.getHours()+":"+hora.getMinutes()+":0"+hora.getSeconds();
        }
        else {
            cad=hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds();
        }
    }
    return cad;
} 
//Funcion que llama al programa
function init() {
    pregunta_nombre();
    canvas=document.getElementById("myCanvas");
    ctx=canvas.getContext("2d");
    ctx.strokeStyle='rgb(0,0,0)';
    tablas_a_0();
    dibujarCuadros(0);
    dibujarCuadros(330);
    dibujar_panel();
    dibujar_panel_record();
    init_puntu();
    botones();
    generar_naves(tabla_maquina);
    generar_naves(tabla_jugador);
    dibujar_naves_maquina();
}