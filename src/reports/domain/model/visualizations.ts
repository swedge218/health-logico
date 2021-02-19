export class Visualizations {

    makeGroupedBarChartData = (array1, array2, selector, index1, index2) => {
        const arr = {};

        for(const key in array1) {
            const hospitalName = array1[key][selector];
            arr[hospitalName] = {
                [index1]: Number(array1[key][index1]),
                [index2]: Number(array2[key][index2])
            }
        }

        return arr;
    }

}