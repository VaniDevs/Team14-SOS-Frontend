// TODO: rename this to the final api host
var host = "http://boiling-headland-57707.herokuapp.com";

var SosContainer = React.createClass({
    loadSosFromServer: function(sos_uuid) {
        var apiUrl = host + '/sos/' + sos_uuid;
        console.log(apiUrl);
        $.ajax({
            url: apiUrl,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({sosProfile: data});
                this.setState({locationList: data.location_list});
                //console.log(this.state.locationList);
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
                //console.log(this.state.items);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadUserProfile: function(user_uuid) {
        var apiUrl = host + '/user/' + user_uuid;
        //console.log(apiUrl);
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
        return {
            items: [], 
            sosProfile: {},
            userProfile: {},
            locationList: []
        };
    },
    componentWillMount: function() {
        this.loadSosListFromServer();
        // websocket this instead of polling
        setInterval(this.loadSosListFromServer, this.props.pollInterval);
    },
    handleClick: function(sos) {
        this.loadSosFromServer(sos.sos_uuid);
        this.loadUserProfile(sos.user_uuid);
    },
    handlePoll: function() {
        //setInterval(this.loadSosFromServer, this.props.pollInterval);
    },
    render: function() {
        var boundPoll = this.handlePoll.bind(this, this.state.sosProfile);
        return (
            <div className="sosContainer">
                <table className="table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>SOS ID</th>
                            <th>Show Info</th>
                            <th>Complete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.items.map(function(item) {
                            var boundClick = this.handleClick.bind(this, item);
                            return (
                                <SosItem data={item} onClick={boundClick} key={item.sos_uuid} />
                            );
                        }, this)}
                    </tbody>
                </table>
                <SosInformation key={this.state.sosProfile.sos_uuid} data={this.state.sosProfile} locationData={this.state.locationList} userData={this.state.userProfile} handlePoll={boundPoll}/>
            </div>
        );
    }
});

var SosItem = React.createClass({
    render: function() {
        var ButtonToolbar = ReactBootstrap.ButtonToolbar;
        var Button = ReactBootstrap.Button;
        var complete = this.props.data.status == 0 ? "true" : "false";
        return (
            <tr id={this.props.data.user_uuid}>
                <td className="col-xs-12 col-sm-3">{this.props.data.user_uuid}</td>
                <td className="col-xs-12 col-sm-3">{this.props.data.sos_uuid}</td>
                <td className="col-xs-12 col-sm-3">
                    <Button bsStyle="primary" id={this.props.data.sos_uuid} onClick={this.props.onClick}>Open User Info</Button>
                </td>
                <td>{complete}</td>
            </tr>
        );
    }
});

var SosInformation = React.createClass({
    getInitialState: function() {
        return {showModal: false, status: 1};
    },
    closeRequest: function() {
        var apiUrl = host + "/sos/" + this.props.data.sos_uuid + "/status/"
        console.log(apiUrl);
        $.ajax({
            method: 'POST',
            url: apiUrl,
            dataType: 'json',
            data: {
                status: 0
            },
            cache: false,
            success: function(data) {
                console.log(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(apiUrl, status, err.toString());
            }.bind(this)
        })
    },
    close: function() {
        this.setState({showModal: false});
    },
    open: function() {
        this.setState({showModal: true});
    },
    componentWillMount: function() {
        this.open();
    },
    // componentWillReceiveProps: function() {
    //     this.open();
    // },
    complete: function() {
        this.closeRequest();
        this.close();
    },
    render: function() {
        if (!this.props.data.user_uuid) {
            return null;
        } else {
            var Modal = ReactBootstrap.Modal;
            var Button = ReactBootstrap.Button;
            var running = this.props.data.status != 0 ? true : false;
            return (
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.userData.user_uuid}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="sosProfile">
                        <User data={this.props.userData} />
                        <Location locs={this.props.locationData} handlePoll={this.props.handlePoll}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.complete} disabled={!running}>Complete</Button>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            );
        }
    }
});

var User = React.createClass({
    render: function() {
        var userInfo = this.props.data;
        return (
            <ul className="userInfo">
                <li>{userInfo.user_uuid}</li>
                <li>First Name: {userInfo.first_name}</li>
                <li>Last Name: {userInfo.last_name}</li>
                <li>Date of Birth: {userInfo.dob}</li>
                <li>Home Address: {userInfo.address_home}</li>
                <li>Ph. Number: {userInfo.phone_number}</li>
                <li>Emergency Ph.: {userInfo.emergency_phone}</li>
                <li>Emergency Contact: {userInfo.emergency_contact}</li>
                <li>Secret Code: {userInfo.secret_code}</li>
            </ul>
        );

    }
});

var Location = React.createClass({
    componentDidMount: function() {
        this.defaultLatitude = 49.2639949;
        this.defaultLongitude = -123.1065752;
    },
    render: function() {
        var locations = this.props.locs;
        if (typeof locations == "string") {
            locations = stringToArr(locations);
            locations = JSON.parse(locations);
        }
        if (!locations) {
            return null;
        }
        else {
            var longitude = this.defaultLongitude;
            var latitude = this.defaultLatitude;
            if (locations.length > 0) {
                longitude = locations[locations.length-1].longitude;
                latitude = locations[locations.length-1].latitude;
            }
            var gmapUrl = "https://www.google.com/maps/embed/v1/place?q=" + latitude + "%2C" + longitude + "&key=AIzaSyAxRNx6IsUplk23NIc03uvKdd5o4BdhS3g";
            return (
                <div className="locationContainer">
                    <iframe width="400" height="360" frameBorder="0" id="gmap" src={gmapUrl} allowFullScreen></iframe>
                </div>
            );
        }
    }
});

function stringToArr(sta) {
    sta = replaceAll(sta, 'u\'', '\'');
    return replaceAll(sta, '\'', '"');
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}


ReactDOM.render(
    <SosContainer url={host + "/sos/"} pollInterval={2000} />,
    document.getElementById('content')
);
