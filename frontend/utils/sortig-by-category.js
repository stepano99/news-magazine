export const sortByCategory = (arr) => {
    const myArray = arr;
    if(!myArray){
        return {
            politics: 0,
            sport: 0,
            events: 0,
            news: 0,
            total: 0,
            views: 0
        }
    }
    var politicsCount = 0;
    var sportCount = 0;
    var eventsCount = 0;
    var newsCount = 0;
    var views = 0;


    for(let i = 0; i < myArray.length - 1; i++){
        if(myArray[i].category === 'politics'){
            politicsCount++
        } else if(myArray[i].category === 'sport'){
            sportCount++
        } else if(myArray[i].category === 'news'){
            newsCount++
        } else {
            eventsCount++
        }
        views += myArray[i].views
    }

    return {
        politics: politicsCount,
        sport: sportCount,
        events: eventsCount,
        news: newsCount,
        total: politicsCount + sportCount + eventsCount + newsCount,
        views: views
    }
}