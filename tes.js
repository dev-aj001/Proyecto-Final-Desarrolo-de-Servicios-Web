function minCostPath(field = [[]]){

    // rules:
    // 1. start from top left
    // 2. only go right or down
    // 3. you can not go back

    // find min cost path

    const rows = field.length;
    const cols = field[0].length;

    let prevSum = Number.MAX_SAFE_INTEGER;
    let currSum = 0;

    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if(j>0){
                break
            }
            currSum += field[i][j];
        }
    }
}

const field = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

minCostPath(field);