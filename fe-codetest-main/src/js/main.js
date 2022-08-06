console.log("javascript entry point");

$(document).ready(function(){
    console.log("Didn't have time to insert these as articles unfortunately!")
    getData();
})

function getData(){
    $.ajax({
        url: 'https://codetest.drumbeat-server.co.uk/wp-json/wp/v2/posts?_embed&per_page=100',
        async:false,
        crossDomain: true,
        success: function(data) {
            console.log(data);
        }
    });
}