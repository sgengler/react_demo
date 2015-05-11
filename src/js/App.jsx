// var Parent = require('./Parent');

// React.render(<Parent />, document.getElementById('app'));

var FriendsContainer = React.createClass({
	getInitialState: function(){
		return {
			name: 'Loading Name',
			searches: []
		}
	},
	getUser: function(username) {
		var self = this;
		$.get('https://api.github.com/users/' + username, function(data) {
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
			<form onSubmit={this.handleAddNew}>
				<input type="text" value={this.state.searchInput} onChange={this.updateNewFriend} />
				<button type="submit"> Lookup </button>
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
	handleAddNew: function(e){
		this.props.searchUser(e.target.value);
		this.setState({
			searchInput: ''
		});
	},
	render: function(){
		var listItems = this.props.searches.map(function(user){
			return <li> {user.name} </li>;
		});
		return (
			<div>
				<h3> Friends </h3>
				<ul>
					<span onClick={this.handleAddNew}>{listItems}</span>
				</ul>
			</div>
		)
	}
});

React.render(<FriendsContainer />, document.getElementById('app'));