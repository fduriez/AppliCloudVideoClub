$(document).ready(function() {
// On document charge fill ddl
fill_store_ddl();
fill_category_ddl();
});

/****************** General Drop Down List ****************/
function hide_result(name){
			document.getElementById(name).style.display = 'none';
}
function fill_category_ddl(){
	$.ajax({
		url:"http://localhost:3000/getAllCategories",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		type:"GET",
		timeout:"5000",
		async:false,
		success: function(data){
			var option = '';
			$.each(data, function(i, elem){
				option = '<option value="'+elem._id+'">'+elem._id+'</option>';
				$(option).appendTo('#category_ddl');
			});
		},
		error : function(xhr, status, err) {
			alert(err);
		}
	});
}
function fill_store_ddl(){
  $.ajax({
    url:"http://localhost:3000/getAllStores",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    type:"GET",
    timeout:"5000",
    async:false,
    success: function(data){
      var option = '';
      $.each(data, function(i, elem){
        option = '<option value="'+elem._id+'">'+elem._id+" - "+elem.address.address+", "+elem.address.city+'</option>';
        $(option).appendTo('#store_ddl');
		$(option).appendTo('#store2_ddl');
		$(option).appendTo('#store3_ddl');
      });
    },
    error : function(xhr, status, err) {
      alert(err);
    }
  });
}

/****************** Standar User *************************/
// Search movie information
function search_movie_inf(){
// Get Selected Values
  var movie = $("#movie_search").val();
  var store_ddl = document.getElementById('store2_ddl');
  var store = store_ddl.options[store_ddl.selectedIndex].value;
  var url;
  if(store == "")
	  url = "http://localhost:3000/getFilmsByTitle?title="+movie;
  else url = "http://localhost:3000/getFilmsByTitle?title="+movie+"&storeID="+store;
  
  if(movie == ""){
    alert("Please enter a movie name");
  }else{
    $.ajax({
      url:url, 
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      type:"GET",
      timeout:"5000",
      async:false,
      success: function(data){
        var display ="";
        $.each(data, function(i, elem){
		console.log(elem);
			display += '';
			display += '<h4>'+elem.title+'</h4>'
					+ '<p><b>description : </b>'+elem.description+'</p>'
					+ '<p><b>release year : </b>'+elem.release_year+'</p>'
					+ '<p><b>language : </b>'+elem.language+'</p>'
					+ '<p><b>category : </b>'+elem.category[0]+'</p>'
					+ '<p><b>inventory : </b>'+elem.inventory+'</p>'
					+ '<p><b>special features : </b>'+elem.special_features+'</p>';

        });
		var to_empty = document.getElementById('movie_search_result');
		to_empty.innerHTML = '';
		$(display).appendTo('#movie_search_result');
		document.getElementById('result_movie').style.display = 'block';
      },
      error : function(xhr, status, err) {
        alert(err);
      }
    });
  }
}

// Movie list for category
function search_movie_category(){
  // Get selected values
	var cat_ddl = document.getElementById('category_ddl');
	var category = cat_ddl.options[cat_ddl.selectedIndex].value;
    var store_ddl = document.getElementById('store_ddl');
	var store = store_ddl.options[store_ddl.selectedIndex].value;
	var url;
	if(store == "")
	  url = "http://localhost:3000/getFilmsByCategory?category="+category;
	else url = "http://localhost:3000/getFilmsByCategory?category="+category+"&storeID="+store;
	console.log(url);
		if( category == null){
			alert(" Please select a category");
		}else{
			$.ajax({
						url:url,
						dataType: "json",
						contentType: "application/json; charset=utf-8",
						type:"GET",
						timeout:"5000",
						async:false,
						success: function(data){
              var display ="";
              $.each(data, function(i, elem){
				display += '<h4>'+elem.title+'</h4>'
					+ '<p><b>description : </b>'+elem.description+'</p>'
					+ '<p><b>release year : </b>'+elem.release_year+'</p>'
					+ '<p><b>language : </b>'+elem.language+'</p>'
					+ '<p><b>category : </b>'+elem.category+'</p>'
					+ '<p><b>inventory : </b>'+elem.inventory+'</p>'
					+ '<p><b>special features : </b>'+elem.special_features+'</p>';
              });
              var to_empty = document.getElementById('category_search_result');
              to_empty.innerHTML = '';
              $(display).appendTo('#category_search_result');
              document.getElementById('result_available').style.display = 'block';
						},
						error : function(xhr, status, err) {
              alert(err);
						}
					});
			}
}

// Movie by actor
function search_movie_actor(){
  var actor = $("#actor_search").val();
  if(actor == ""){
    alert("Please enter an actor name");
  }else{
    $.ajax({
      url:"http://localhost:3000/getFilmsByActor?name="+actor,
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      type:"GET",
      timeout:"5000",
      async:false,
      success: function(data){
        var display ="";
        $.each(data, function(i, elem){
				console.log(elem);
          			display += '<h4>'+elem.title+'</h4>'
					+ '<p><b>description : </b>'+elem.description+'</p>'
					+ '<p><b>release year : </b>'+elem.release_year+'</p>'
					+ '<p><b>language : </b>'+elem.language+'</p>'
					+ '<p><b>category : </b>'+elem.category+'</p>'
					+ '<p><b>inventory : </b>'+elem.inventory+'</p>'
					+ '<p><b>special features : </b>'+elem.special_features+'</p>';
        });

  			var to_empty = document.getElementById('actor_search_result');
  			to_empty.innerHTML = '';
  			$(display).appendTo('#actor_search_result');
  			document.getElementById('result_actor').style.display = 'block';
      },
      error : function(xhr, status, err) {
        alert(err);
      }
    });
  }
}

// TOP 10 Movies Rental
function get_top(){
  $.ajax({
        url:"http://localhost:3000/getTopFilmsByMonth?date=2006-02-28",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type:"GET",
        timeout:"5000",
        async:false,
        success: function(data){
          var display ="<ul>";
          $.each(data, function(i, elem){          
				display += '<h4>'+elem.movie.title+'</h4>'
				+ '<p><b>description : </b>'+elem.movie.description+'</p>'
				+ '<p><b>release year : </b>'+elem.movie.release_year+'</p>'
				+ '<p><b>language : </b>'+elem.movie.language+'</p>'
				+ '<p><b>category : </b>'+elem.movie.category+'</p>'
				+ '<p><b>inventory : </b>'+elem.movie.inventory+'</p>'
				+ '<p><b>special features : </b>'+elem.movie.special_features+'</p>';
			});
         
          var to_empty = document.getElementById('top_result');
          to_empty.innerHTML = '';
          $(display).appendTo('#top_result');
          document.getElementById('result_top').style.display = 'block';
        },
        error : function(xhr, status, err) {
          alert(err);
        }
      });
}
/*********************** Analyst  ***********************/
// Number of movies rent for a date
function search_month_year(){
  // Get selected values
		var m_ddl = document.getElementById('month_ddl');
		var month = m_ddl.options[m_ddl.selectedIndex].value;
		var y_ddl = document.getElementById('year_ddl');
		var year = y_ddl.options[y_ddl.selectedIndex].value;
		console.log("month="+month+", year="+year);
		
		if( month == null || year == null){
			alert(" Please select a month and a year ");
		}else{
			$.ajax({
						url:"http://localhost:3000/getNbRentalByDate",
						data:{
							'month':month,
							'year':year
						},
						dataType: "json",
						contentType: "application/json; charset=utf-8",
						type:"GET",
						timeout:"5000",
						async:false,
						success: function(data){
				console.log(data);
                var display = '<h4>'+data[0].tot+'</h4>';
              var to_empty = document.getElementById('month_year_result');
              to_empty.innerHTML = '';
              $(display).appendTo('#month_year_result');
              document.getElementById('result_month').style.display = 'block';
						},
						error : function(xhr, status, err) {
              alert(err);
						}
					});
			}
}

// Get TOP rental
function search_category_store(){
  // Get selected values
    var store_ddl = document.getElementById('store3_ddl');
    var store = store_ddl.options[store_ddl.selectedIndex].value;
	if(store == "")
	  url = "http://localhost:3000/getNbRentalBycategory";
	else url = "http://localhost:3000/getNbRentalBycategory?storeID="+store;
	
      $.ajax({
            url:url,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type:"GET",
            timeout:"5000",
            async:false,
            success: function(data){
              var display ="";
			  display += '<p><b>Category : Number of rental</p>';
              $.each(data, function(i, elem){
                display += '<p><b>'+elem._id+' : </b>'+elem.tot+'</p>';
              });
               display += '</ul>';
              var to_empty = document.getElementById('category_result');
              to_empty.innerHTML = '';
              $(display).appendTo('#category_result');
              document.getElementById('result_category').style.display = 'block';
            },
            error : function(xhr, status, err) {
              alert(err);
            }
          });
}
/************************** Admin ***********************/
function get_admin(){
  $.ajax({
        url:"http://localhost:3000/getInfosCluster",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type:"GET",
        timeout:"5000",
        async:false,
        success: function(data){
			console.log(data);
          var display ="";
          $.each(data.raw, function(i, elem){
			
		  display += '</br></br><h4> '+i+'</h4>'
				+ '<b><p>avgObjSize : </b>'+elem.avgObjSize+'</p>'
				+ '<b><p>Number of collections : <b>'+elem.collections+'</p>'
				+ '<b><p>indexSize : </b>'+elem.dataSize+'</p>'
				+ '<b><p>indexSize : </b>'+elem.indexSize+'</p>'
				+ '<b><p>indexes   : </b>'+elem.indexes+'</p>';
          });
           display += '</ul>';
          var to_empty = document.getElementById('admin_result');
          to_empty.innerHTML = '';
          $(display).appendTo('#admin_result');
        },
        error : function(xhr, status, err) {
          alert(err);
        }
      });
}
