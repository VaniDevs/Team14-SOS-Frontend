var SosContainer = React.createClass({
    loadSosListFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadSosListFromServer();
        // websocket this instead of polling
        //setInterval(this.loadSosListFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="sosBox">
                <SosList data={this.state.data} />
            </div>
        );
    }
});

var SosListItemWrapper = React.createClass({
  render: function() {
    return (
        <div className="sosListItemWrapper">
            <SosButton data={this.props.data.sos_uuid} />
        </div>
        );
  }
});


var SosList = React.createClass({
    render: function() {
        return (
            <div className="sosList">
                {this.props.data.map(function(sos) {
                    return <SosListItemWrapper key={sos.user_uuid} data={sos}/>;
                })}
            </div>
        );
    }
});

var SosButton = React.createClass({
    loadSosFromServer: function(sos_uuid) {
        var url = "/sos/" + sos_uuid;
        console.log(url);
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                //this.setState({data: data});
                console.log(data);  
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    handleClick: function(sos_uuid) {
        this.loadSosFromServer(sos_uuid);
    },
    render: function() {
        return (
            <button className="sosButton" onClick={this.handleClick.bind(this, this.props.data)}>Open User</button>
        );
    }
});

var SosProfile = React.createClass({
    render: function() {
        return (

        );
    }
});

ReactDOM.render(
    <SosContainer url="/sos" pollInterval={2000} />,
    document.getElementById('content')
);
