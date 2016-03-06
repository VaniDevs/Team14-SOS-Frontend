var host = "http://secret-earth-48637.herokuapp.com";

var getProfile = function(userId, handleData) {
    var url = host + "/user/" + userId;
    $.ajax({
        url: url,
        dataType: 'json',
        cache: false,
        success: function(data) {
            //console.log(data);
            handleData(data);
        },
        error: function(xhr, status, err) {
            console.error(url, status, err.toString());
        }
    });
};

var getSosList = function(handleData) {
    var url = host + "/sos/";
    $.ajax({
        url: url,
        dataType: 'json',
        cache: false,
        success: function(data) {
            //console.log(data);
            handleData(data);
        },
        error: function(xhr, status, err) {
            console.error(url, status, err.toString());
        }
    });
};

var getSos = function(sosUuid, handleData) {
    var url = host + "/sos/" + sosUuid;
    $.ajax({
        url: url,
        dataType: 'json',
        cache: false,
        success: function(data) {
            //console.log(data);
            handleData(data);
        },
        error: function(xhr, status, err) {
            console.error(url, status, err.toString());
        }
    });
};

$(document).ready(function() {
    getSosList(function(sosList) {
        $.each(sosList, function(i, sos) {
            var
        })
    });
});
