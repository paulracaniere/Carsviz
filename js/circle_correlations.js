function correlation_update(listOfIndices, correlations){
    //setOfEngineCharIndices
    //dataset
    listOfIndices.sort();
    for(let i = 0; i < engineSpecs.length; i++){

        indice = listOfIndices.indexOf(i);
        if(indice != -1){

        
            let corPC1 = 0;
            let corPC2 =0;
            let data_revelant = dataset.length;
            let name = engineSpecs[listOfIndices[indice]];
            for(let id_data = 0; id_data < dataset.length; id_data++){

                if( !(dataset[id_data].PC1 === 0.0 && dataset[id_data].PC2===0.0) ){
                    switch(name){
                        //["MPG", "Cylinders", "Displacement", "Horsepower", "Weight", "Acceleration"]
                        case "MPG":
                            corPC1 += dataset[id_data].PC1 * dataset[id_data].mpg_norm;
                            corPC2 += dataset[id_data].PC2 * dataset[id_data].mpg_norm ;
                            break;
                        case "Cylinders":
                            corPC1 += dataset[id_data].PC1 * dataset[id_data].cylinders_norm;
                            corPC2 += dataset[id_data].PC2 * dataset[id_data].cylinders_norm ;
                            break;
                        case "Displacement":
                            corPC1 += dataset[id_data].PC1 * dataset[id_data].displacement_norm;
                            corPC2 += dataset[id_data].PC2 * dataset[id_data].displacement_norm;
                            break;
                        case "Horsepower":
                            corPC1 += dataset[id_data].PC1 * dataset[id_data].hp_norm;
                            corPC2 += dataset[id_data].PC2 * dataset[id_data].hp_norm ;    
                            break;
                        case "Weight":
                            corPC1 += dataset[id_data].PC1 * dataset[id_data].weight_norm;
                            corPC2 += dataset[id_data].PC2 * dataset[id_data].weight_norm ;
                            break;
                        case "Acceleration":
                            corPC1 += dataset[id_data].PC1 * dataset[id_data].acceleration_norm;
                            corPC2 += dataset[id_data].PC2 * dataset[id_data].acceleration_norm ;
                            break;
                    }
                }
                else{
                    data_revelant -= 1;
                }
            }
            sig = sigma_PC();
            corPC1 /= (data_revelant*sig[0]);
            corPC2 /= (data_revelant*sig[1]);
            
    
            correlations[listOfIndices[indice]].x =corPC1;
            correlations[listOfIndices[indice]].y =corPC2;
            correlations[listOfIndices[indice]].selected = true;
        }
        else{
            correlations[i].selected = false;
            correlations[i].x = 0;
            correlations[i].y = 0;

        }


    }
    return correlations;
}


function sigma_PC(){
    moyPC1 = 0
    moyPC2 = 0
    nb_data = dataset.length
    for(let id_data = 0; id_data < dataset.length; id_data++){
        if( dataset[id_data].PC1 !=0){
            moyPC1 += dataset[id_data].PC1;
            moyPC2 += dataset[id_data].PC2;

        }
        else{
            nb_data -= 1;
        }
    }
    moyPC1 /= nb_data;
    moyPC2 /= nb_data;
    varPC1 =0;
    varPC2= 0;
    for(let id_data = 0; id_data < dataset.length; id_data++){
        if( dataset[id_data].PC1 !=0){
            varPC1 += Math.pow(moyPC1 - dataset[id_data].PC1, 2);
            varPC2 += Math.pow(moyPC2 - dataset[id_data].PC2,2);
        }
    }



    sigmaPC1 = Math.sqrt(varPC1/nb_data);
    sigmaPC2 = Math.sqrt(varPC2/nb_data);
    return [sigmaPC1, sigmaPC2]
}


function generate_correlations(){
    let correlations = [];
    for(let i = 0; i < engineSpecs.length; i++){
        correlations.push({
            name: engineSpecs[i],
            x: 0,
            y:0,
            selected: true
        });
    }
    return correlations;
}