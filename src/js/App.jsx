
var FriendsContainer = React.createClass({
	getInitialState: function(){
		return {
			name: 'Loading Name',
			searches: []
		}
	},
	getUser: function(username) {
		var self = this;

		var apiCreds = '?client_id=9d0b0fe0b89a917aaf7c&client_secret=6ad113d9305d7bf752ba07b647a04e1ec49d24f9';

		var params = {
			client_id: "9d0b0fe0b89a917aaf7c",
			client_secret: "6ad113d9305d7bf752ba07b647a04e1ec49d24f9"
		}

		$.get('https://api.github.com/users/' + username, params, function(data) {
			data.name = data.name ? data.name : data.login;
			self.state.searches.push(data);
			self.setState(data);
			console.log(self.state);
		});
	},
	searchUser: function(username){
		this.getUser(username);
	},
	componentDidMount: function(){
		this.getUser('sgengler');
	},
	render: function(){
		return (
			<div>
				<h3>Name: {this.state.name}</h3>
				<img width={200} className={"img-rounded img-thumbnail"} src={this.state.avatar_url}/>
				
				<AddFriend searchUser={this.searchUser} />
				<SearchList searchUser={this.searchUser} searches={this.state.searches} />
			</div>
		)
	}
});

var AddFriend = React.createClass({
	getInitialState: function(){
		return {
			searchInput: ''
		}
	},
	updateNewFriend: function(e){
		this.setState({
			searchInput: e.target.value
		});
	},
	handleAddNew: function(e){
		e.preventDefault();
		this.props.searchUser(this.state.searchInput);
		this.setState({
			searchInput: ''
		});
	},
	render: function(){
		return (
			<form onSubmit={this.handleAddNew} className={"form-inline"}>
				<input type="text" className={"form-control"} value={this.state.searchInput} onChange={this.updateNewFriend} />
				<button type="submit" className={"btn btn-primary"}> Lookup </button>
			</form>
		);
	}
});

var SearchList = React.createClass({
	getDefaultProps: function(){
		return {
			searches: []
		}
	},
	getInitialState: function() {
		return {
			toggle: {}
		}
	},
	handleAddNew: function(e){
		e.preventDefault();
		var searchName = e.target.value;
		console.log(e.target);
		console.log(this.props.searches);
		var search = $.grep(this.props.searches, function(e){console.log(e.name); return e.name == searchName; });
		this.props.searchUser(search.login);
		this.setState({
			searchInput: ''
		});
	},
	sortList: function(field) {
		var isNum = !isNaN(this.props.searches[0][field]),
			toggleState = !this.state.toggle[field];

		this.state.toggle = {}
		this.state.toggle[field] = toggleState;

		this.props.searches.sort(function(a,b) { 
			if(a[field] < b[field]) {return -1}
			if(a[field] > b[field]) {return 1}
			return 0;
		});

		if(isNum) {this.props.searches.reverse()}
		if(!this.state.toggle[field]) {this.props.searches.reverse()}

		console.log(this.state.toggle);

		this.setState(this.props.searches);
		this.setState(this.state.toggle);
	},
	render: function(){
		var listItems = this.props.searches.map(function(user, index){
			return <tr>
						<td>{index}</td>
						<td>{user.name}</td>
						<td>{user.login}</td>
						<td>{user.public_repos}</td>
						<td>{user.followers}</td>
					</tr>;
		});
		return (
			<div>
				<h3> Searches </h3>
				<table className={"table table-striped"}>
					<thead>
						<tr>
							<th>#</th>
							<th><a href="javascript:;" onClick={this.sortList.bind(this, 'name')}>Name</a></th>
							<th><a href="javascript:;" onClick={this.sortList.bind(this, 'login')}>Username</a></th>
							<th><a href="javascript:;" onClick={this.sortList.bind(this, 'public_repos')}>Repos</a></th>
							<th><a href="javascript:;" onClick={this.sortList.bind(this, 'followers')}>Followers</a></th>
						</tr>
					</thead>
					<tbody>
						{listItems}
					</tbody>
				</table>
			</div>
		)
	}
});

React.render(<FriendsContainer />, document.getElementById('app'));