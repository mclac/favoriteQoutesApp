"use strict"
var app = angular.module("faveQouteApp", [
	"ngRoute"
	])

app.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/",{
		controller: "showPostsCtrl",
		templateUrl: "views/chatPosts.html"
	})
	.when("/posts/:postID",{
		controller: "editPostCtrl",
		templateUrl: "views/editPost.html"
	})
}])

app.controller("showPostsCtrl", ["$scope", "$location", "postSvc", 
	function($scope, $location, postSvc) {

	//retrieve all posts
	postSvc.getPosts()
	.then(function(response) {
		//set posts in view = to the returned array
		//ng-repeat in view will loop through array and display posts
		$scope.posts = response.data
	})
	.catch(function(error) {
		$scope.posts = error
	})

	$scope.postComment = function() {
		//set author and body to their respective values in the view
		//could ng-model the entire form and avoid using {obj} format
		//but to keep view cleaner did it this way instead
		if ($scope.commentAuthor == false || $scope.commentBody == false ) {
			alert("Please fill both fields")
		}

		postSvc.postPosts({
			"author": $scope.commentAuthor,
			"body": $scope.commentBody
		})
		.then(function(response) {
			//upon successful execution use returned object and unshift it
			//in the view array
			$scope.posts.unshift(response.data)
			$scope.commentBody = null
			$scope.commentAuthor = null
		})
		.catch(function(error) {
			return alert(error)
		})
	}

	$scope.edit = function(post) {
		//send user to the specific url attached to specific comment
		var postUrl = "/posts/" + post._id;
            $location.path(postUrl);
	}
	$scope.delete = function(post) {	
		//set post._id to a variable to make it easier to use JS methods
		var postID = post._id
		postSvc.deletePost(postID)
		//send the ID "pre-snipped" to deletion service to show a diffrent kind of manipulation
		.then(function(response) {
			//delete the post in the view if successful

			//set up neccessary function to return post obj
			//in combo with findIndex will loop till finds exact match
			function findMe (x) {
				if (x === post) {
					return x
				} 
			}

			//then remove from view
			var myArray = $scope.posts
			var postIndex = myArray.findIndex(findMe)
			myArray.splice(postIndex, 1)
			
			return response
		})
		.catch(function(error) {
			return alert(error)
		})
	}

}])

app.controller("editPostCtrl", ["$scope", "$location", "postSvc", 

	function($scope, $location, postSvc) {
		var url = $location.$$path

		//this retrieves the selected objects data by calling a get method
		//next it prefills inputs for ease of use 
		postSvc.getSinglePost(url)
		.then(function(response) {
			$scope.commentAuthor = response.data.author
			$scope.commentBody = response.data.body
		})
		.catch(function(error) {
			return alert(error)
		})


	$scope.saveEdit = function() {
		//takes the /posts/:id path and saves it
		if ($scope.commentAuthor == false || $scope.commentBody == false ) {
			alert("Please fill both fields")
		}

		var url = $location.$$path
		var comment = {
			"author": $scope.commentAuthor,
			"body": $scope.commentBody
		}
		//sends the path and updated object on submit
		postSvc.editPost(url, comment)
		.then(function(response) {
			//when successful returns user to home page
			$location.path("")
			return response
		})
		.catch(function(error) {
			return alert(error)
		})
	}

	$scope.cancelEdit = function() {
		//cancel edit and return to home page
		$location.path("")
	}


}])

app.service("postSvc", ["$http", function($http) {

	this.getPosts = function() {
		//returned posts populate default view
		return $http.get("/posts")
		.then(function(response) {
			return response
		})
		.catch(function(error) {		
			return alert(error)
		})
	}
	this.postPosts = function(post) {
		//returned post is used to unshift post array in view
		return $http.post("/posts", post)
		.then(function(response) {
			return response
		})
		.catch(function(error) {
			return alert(error)
		})
	}

	this.getSinglePost = function(url) {
		//entire path is sent in no need to search for it in sent object
		return $http.get(url)
		.then(function(response) {
			return response
		})
		.catch(function(error) {
			return alert(error)
		})
	}

	this.editPost = function(url, post) {
		//entire path is sent in no need to search for it in sent object
		return $http.put(url, post)
		.then(function(response) {
			return response
		})
		.catch(function(error) {
			return alert(error)
		})
	}
	this.deletePost = function(postID) {
		//only ID sent in need to concat the path
		var url =  "/posts/" + postID

		return $http.delete(url)
		.then(function(response) {
			return response
		})
		.catch(function(error) {
			return alert(error)
		})
	}
}])