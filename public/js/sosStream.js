var host = "http://secret-earth-48637.herokuapp.com";

var SosContainer = React.createClass({
    loadSosFromServer: function(sos_uuid) {
        var apiUrl = host + '/sos/' + sos_uuid;
        //console.log(apiUrl);
        $.ajax({
            url: apiUrl,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({sosProfile: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(apiUrl, status, err.toString());
            }.bind(this)
        })
    },
    loadSosListFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({items: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadUserProfile: function(user_uuid) {
        var apiUrl = host + '/user/' + user_uuid;
        console.log(apiUrl);
        $.ajax({
            url: apiUrl,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({userProfile: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(apiUrl, status, err.toString());
            }.bind(this)
        })
    },
    getInitialState: function() {
        return {items: [], sosProfile: {}, userProfile: {}};
    },
    componentDidMount: function() {
        this.loadSosListFromServer();
        //this.loadProfileFromServer("0e23ec50e065a149e5f62126106b13f3977ef6c35e7b9dad93be72d18d1511c9");
        // websocket this instead of polling
        //setInterval(this.loadSosListFromServer, this.props.pollInterval);
    },
    handleClick: function(sos) {
        this.loadSosFromServer(sos.sos_uuid);
        this.loadUserProfile(sos.sos_user);
    },
    handlePoll: function() {
        setInterval(this.loadSosFromServer, 2000);
    },
    render: function() {
        var boundPoll = this.handlePoll.bind(this, this.state.sosProfile));
        return (
            <div className="sosContainer">
                {this.state.items.map(function(item) {
                    var boundClick = this.handleClick.bind(this, item);
                    // TODO: handle cases where user_uuid already exists
                    return (
                        <SosItem data={item} onClick={boundClick} key={item.user_uuid} />
                    );
                }, this)}
                <SosInformation data={this.state.sosProfile} userData={this.state.userProfile} handlePoll={boundPoll}/>
            </div>
        );
    }
});

var SosItem = React.createClass({
    render: function() {
        return (
            <div className="sosRow" id={this.props.data.user_uuid}>
                <button id={this.props.data.sos_uuid} onClick={this.props.onClick}>click me</button>
            </div>
        );
    }
});

var SosInformation = React.createClass({
    render: function() {
        if (this.props.data.sos_user == null) {
            return false;
        } else {
            return (
                <div className="sosProfile">
                    <User data={this.props.userData} />
                    <Location data={this.props.data} handlePoll={this.props.handlePoll}/>
                </div>
            );
        }
    }
});

var User = React.createClass({
    render: function() {
        var userInfo = this.props.data;
        return (
            <ul>
                <li>{userInfo.user_uuid}</li>
                <li>{userInfo.first_name}</li>
                <li>{userInfo.last_name}</li>
                <li>{userInfo.dob}</li>
                <li>{userInfo.address_home}</li>
                <li>{userInfo.phone_number}</li>
                <li>{userInfo.emergency_phone}</li>
                <li>{userInfo.emergency_contact}</li>
                <li>{userInfo.secret_code}</li>
            </ul>
        );

    }
});

var Location = React.createClass({
    render: function() {
        return (
            <h1>fuck you</h1>
        );
    }
});

ReactDOM.render(
    <SosContainer url={host + "/sos/"} pollInterval={2000} />,
    document.getElementById('content')
);
