var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var update_event_overview = false;

var EnrollComponent = function (_React$Component) {
    _inherits(EnrollComponent, _React$Component);

    function EnrollComponent(props) {
        _classCallCheck(this, EnrollComponent);

        var _this = _possibleConstructorReturn(this, (EnrollComponent.__proto__ || Object.getPrototypeOf(EnrollComponent)).call(this, props));

        _this.state = {
            error: null,
            isLoaded: false,
            data: []
        };
        return _this;
    }

    _createClass(EnrollComponent, [{
        key: "fetch_enroll",
        value: function fetch_enroll() {
            var _this2 = this;

            var data = new FormData();
            data.append("event_id", this.props.event_id);
            data.append("appointment_id", this.props.appointment_id);
            data.append("deregister", this.props.deregister ? 1 : 0);

            var EnrollInit = {
                method: 'POST',
                cache: 'reload',
                credentials: 'include',
                mode: 'cors',
                referrerPolicy: 'no-referrer-when-downgrade',
                body: data
            };

            fetch("https://mobile.svfreihausen.de/ws/enroll_webservice.php", EnrollInit).then(function (res) {
                return res.json();
            }).then(function (result) {
                _this2.setState({
                    isLoaded: true,
                    data: result
                });
            }, function (error) {
                _this2.setState({
                    isLoaded: true,
                    error: error
                });
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.fetch_enroll();
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
            // Typical usage (don't forget to compare props):
            if (this.props.event_id !== prevProps.event_id || this.props.appointment_id !== prevProps.appointment_id) {
                this.fetch_enroll();
            }
        }
    }, {
        key: "render",
        value: function render() {
            update_event_overview = true;
            ReactDOM.render(React.createElement(EventsComponent, null), document.getElementById('events-overview'));

            var _state = this.state,
                error = _state.error,
                isLoaded = _state.isLoaded,
                data = _state.data;

            if (error) {
                return React.createElement(
                    "div",
                    null,
                    "Error: ",
                    error.message
                );
            } else if (!isLoaded) {
                return React.createElement(
                    "div",
                    null,
                    "Loading..."
                );
            } else {
                enroll_action = "angemeldet";
                if (data.deregister) {
                    enroll_action = "abgemeldet";
                }
                return React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "p",
                        null,
                        "Sie haben sich f\xFCr folgenden Termin ",
                        enroll_action,
                        ":"
                    ),
                    React.createElement(
                        "p",
                        null,
                        React.createElement(
                            "strong",
                            null,
                            "Veranstaltung:"
                        ),
                        " ",
                        data.name,
                        React.createElement("br", null),
                        React.createElement(
                            "strong",
                            null,
                            "Datum / Zeit:"
                        ),
                        " ",
                        data.datetime
                    )
                );
            }
        }
    }]);

    return EnrollComponent;
}(React.Component);

var ParticipantsComponent = function (_React$Component2) {
    _inherits(ParticipantsComponent, _React$Component2);

    function ParticipantsComponent(props) {
        _classCallCheck(this, ParticipantsComponent);

        var _this3 = _possibleConstructorReturn(this, (ParticipantsComponent.__proto__ || Object.getPrototypeOf(ParticipantsComponent)).call(this, props));

        _this3.state = {
            error: null,
            isLoaded: false,
            data: []
        };
        return _this3;
    }

    _createClass(ParticipantsComponent, [{
        key: "fetch_participants",
        value: function fetch_participants() {
            var _this4 = this;

            var data = new FormData();
            data.append("event_id", this.props.event_id);
            data.append("appointment_id", this.props.appointment_id);

            var ParticipantsInit = {
                method: 'POST',
                cache: 'reload',
                credentials: 'include',
                mode: 'cors',
                referrerPolicy: 'no-referrer-when-downgrade',
                body: data
            };

            fetch("https://mobile.svfreihausen.de/ws/participants_webservice.php", ParticipantsInit).then(function (res) {
                return res.json();
            }).then(function (result) {
                _this4.setState({
                    isLoaded: true,
                    data: result
                });
            }, function (error) {
                _this4.setState({
                    isLoaded: true,
                    error: error
                });
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.fetch_participants();
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
            // Typical usage (don't forget to compare props):
            if (this.props.event_id !== prevProps.event_id || this.props.appointment_id !== prevProps.appointment_id) {
                this.fetch_participants();
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _state2 = this.state,
                error = _state2.error,
                isLoaded = _state2.isLoaded,
                data = _state2.data;

            if (error) {
                return React.createElement(
                    "div",
                    null,
                    "Error: ",
                    error.message
                );
            } else if (!isLoaded) {
                return React.createElement(
                    "div",
                    null,
                    "Loading..."
                );
            } else {
                return React.createElement(ListParticipants, { data: data });
            }
        }
    }]);

    return ParticipantsComponent;
}(React.Component);

function ListParticipants(props) {
    attendeesItems = React.createElement(
        "li",
        null,
        "-/-"
    );
    waitlistItems = React.createElement(
        "li",
        null,
        "-/-"
    );

    visible_attendees = props.data.visible_attendees;
    visible_waitlist = props.data.visible_waitlist;

    if (visible_attendees) {
        attendeesItems = visible_attendees.map(function (attendee) {
            return React.createElement(
                "li",
                null,
                attendee
            );
        });
    }

    if (visible_waitlist) {
        waitlistItems = visible_waitlist.map(function (attendee) {
            return React.createElement(
                "li",
                null,
                attendee
            );
        });
    }
    return React.createElement(
        "div",
        null,
        React.createElement(
            "p",
            null,
            React.createElement(
                "strong",
                null,
                "Veranstaltung:"
            ),
            " ",
            props.data.name,
            React.createElement("br", null),
            React.createElement(
                "strong",
                null,
                "Datum / Zeit:"
            ),
            " ",
            props.data.datetime
        ),
        React.createElement(
            "h6",
            null,
            "Teilnehmer:"
        ),
        React.createElement(
            "ul",
            null,
            attendeesItems,
            React.createElement(
                "li",
                null,
                "+",
                props.data.hidden_attendees,
                " weitere Teilnehmer."
            )
        ),
        React.createElement(
            "h6",
            null,
            "Auf der Warteliste:"
        ),
        React.createElement(
            "ul",
            null,
            waitlistItems,
            React.createElement(
                "li",
                null,
                "+",
                props.data.hidden_waitlist,
                " weitere Teilnehmer."
            )
        )
    );
}

function EventInfo(props) {
    return React.createElement(
        "div",
        { "class": "my-3" },
        React.createElement(
            "h2",
            { id: "event_" + props.event_id },
            props.name
        ),
        React.createElement(
            "div",
            { "class": "row no-gutters" },
            React.createElement(
                "div",
                { "class": "col-sm-2 font-italic text-nowrap" },
                "Leiter:"
            ),
            React.createElement(
                "div",
                { "class": "col-md-auto" },
                props.organiser
            )
        ),
        React.createElement(
            "div",
            { "class": "row no-gutters" },
            React.createElement(
                "div",
                { "class": "col-sm-2 font-italic text-nowrap" },
                "E-Mail:"
            ),
            React.createElement(
                "div",
                { "class": "col-md-auto" },
                props.email
            )
        ),
        React.createElement(
            "div",
            { "class": "row no-gutters" },
            React.createElement(
                "div",
                { "class": "col-sm-2 font-italic text-nowrap" },
                "Infos:"
            ),
            React.createElement(
                "div",
                { "class": "col-md-auto" },
                props.info
            )
        )
    );
}

var TermElement = function (_React$Component3) {
    _inherits(TermElement, _React$Component3);

    function TermElement() {
        _classCallCheck(this, TermElement);

        return _possibleConstructorReturn(this, (TermElement.__proto__ || Object.getPrototypeOf(TermElement)).apply(this, arguments));
    }

    _createClass(TermElement, [{
        key: "UpdateParticipantList",
        value: function UpdateParticipantList(event_id, appointment_id) {
            ReactDOM.render(React.createElement(ParticipantsComponent, { event_id: event_id, appointment_id: appointment_id }), document.getElementById('ParticipantsContainer'));
        }
    }, {
        key: "EnrollEvent",
        value: function EnrollEvent(event_id, appointment_id, deregister) {
            ReactDOM.render(React.createElement(EnrollComponent, { event_id: event_id, appointment_id: appointment_id,
                deregister: deregister }), document.getElementById('EnrollModalContainer'));
        }
    }, {
        key: "render",
        value: function render() {
            var _this6 = this;

            appointment = this.props.appointment;
            bgClass = "card bg-secondary o-hidden h-100";
            bgImage = "fas fa-fw fa-calendar-alt";
            termAction = "Anmelden";
            termFull = appointment.num_attendees >= this.props.max_attendees;
            deregister = true;
            if (termFull) {
                bgClass = "card bg-warning o-hidden h-100";
                bgImage = "fas fa-fw fa-calendar-alt";
                termAction = "In Warteliste eintragen";
            }
            if (appointment.user_attendance) {
                bgClass = "card bg-success o-hidden h-100";
                bgImage = "fas fa-fw fa-check";
                termAction = "Abmelden";
                deregister = false;

                if (appointment.on_wait_list) {
                    bgClass = "card bg-danger o-hidden h-100";
                    bgImage = "fas fa-fw fa-history";
                    termAction = "Von Warteliste Abmelden";
                }
            }
            return React.createElement(
                "div",
                { "class": "col-xl-3 col-sm-6 mb-3" },
                React.createElement(
                    "div",
                    { "class": bgClass },
                    React.createElement(
                        "div",
                        { "class": "card-body" },
                        React.createElement(
                            "div",
                            { "class": "card-body-icon" },
                            React.createElement("i", { "class": bgImage })
                        ),
                        React.createElement(
                            "div",
                            { "class": "mr-5" },
                            React.createElement(
                                "span",
                                { "class": "clearfix" },
                                appointment.datetime,
                                ":"
                            ),
                            React.createElement(
                                "span",
                                { "class": "small clearfix" },
                                appointment.num_attendees,
                                " von ",
                                this.props.max_attendees,
                                " Teilnehmerpl\xE4tze belegt."
                            ),
                            React.createElement(
                                "button",
                                { key: appointment.appointment_id, onClick: function onClick(e) {
                                        return _this6.UpdateParticipantList(_this6.props.event_id, _this6.props.appointment.appointment_id, e);
                                    }, "class": "btn btn-outline-primary btn-sm clearfix", type: "button", "data-toggle": "modal", "data-target": "#ParticipantsList" },
                                "Teilnehmerliste"
                            )
                        )
                    ),
                    React.createElement(
                        "a",
                        { onClick: function onClick(e) {
                                return _this6.EnrollEvent(_this6.props.event_id, _this6.props.appointment.appointment_id, deregister, e);
                            }, href: "#", "class": "card-footer clearfix small z-1", "data-toggle": "modal", "data-target": "#EnrollModal" },
                        React.createElement(
                            "span",
                            { "class": "float-left" },
                            termAction
                        ),
                        React.createElement(
                            "span",
                            { "class": "float-right" },
                            React.createElement("i", { "class": "fas fa-angle-right" })
                        )
                    )
                )
            );
        }
    }]);

    return TermElement;
}(React.Component);

function TermElements(props) {
    appointments = props.appointments;
    var termItems = appointments.map(function (appointment) {
        return React.createElement(TermElement, { appointment: appointment, max_attendees: props.max_attendees,
            event_id: props.event_id });
    });
    return React.createElement(
        "div",
        { "class": "row" },
        termItems
    );
}

function EventElement(props) {
    events = props.data;
    return React.createElement(
        "div",
        null,
        React.createElement(EventInfo, { event_id: events.event_id,
            name: events.name,
            organiser: events.organiser,
            email: events.email,
            info: events.info,
            max_attendees: events.max_attendees }),
        React.createElement(TermElements, { appointments: events.appointments,
            max_attendees: events.max_attendees,
            event_id: events.event_id })
    );
}

function EventNavElement(props) {
    return React.createElement(
        "a",
        { "class": "dropdown-item", href: "#event_" + props.data.event_id },
        props.data.name
    );
}

function RenderEventNav(events) {
    ReactDOM.render(events.map(function (eventItem) {
        return React.createElement(EventNavElement, { data: eventItem });
    }), document.getElementById('event-nav'));
}

function EventElements(props) {
    if (!props.data.logged_in) {
        window.location = "login.html";
        return React.createElement(
            "p",
            null,
            "Sie m\xFCssen sich erst einloggen!"
        );
    }

    if (!props.data.access_permission) {
        return React.createElement(
            "p",
            null,
            "Sie haben nicht die notwendigen Rechte f\xFCr diesen Bereich!"
        );
    }

    var eventItems = props.data.events.map(function (eventItem) {
        return React.createElement(EventElement, { data: eventItem });
    });

    RenderEventNav(props.data.events);

    return React.createElement(
        "div",
        null,
        eventItems
    );
}

var EventsComponentInit = {
    method: 'GET',
    cache: 'reload',
    credentials: 'include',
    mode: 'cors',
    referrerPolicy: 'no-referrer-when-downgrade'
};

var EventsComponent = function (_React$Component4) {
    _inherits(EventsComponent, _React$Component4);

    function EventsComponent(props) {
        _classCallCheck(this, EventsComponent);

        var _this7 = _possibleConstructorReturn(this, (EventsComponent.__proto__ || Object.getPrototypeOf(EventsComponent)).call(this, props));

        _this7.state = {
            error: null,
            isLoaded: false,
            data: []
        };
        return _this7;
    }

    _createClass(EventsComponent, [{
        key: "fetch_events",
        value: function fetch_events() {
            var _this8 = this;

            fetch("https://mobile.svfreihausen.de/ws/events_webservice.php", EventsComponentInit).then(function (res) {
                return res.json();
            }).then(function (result) {
                _this8.setState({
                    isLoaded: true,
                    data: result
                });
            }, function (error) {
                _this8.setState({
                    isLoaded: true,
                    error: error
                });
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.fetch_events();
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            if (update_event_overview) {
                update_event_overview = false;
                this.fetch_events();
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _state3 = this.state,
                error = _state3.error,
                isLoaded = _state3.isLoaded,
                data = _state3.data;

            if (error) {
                return React.createElement(
                    "div",
                    null,
                    "Error: ",
                    error.message
                );
            } else if (!isLoaded) {
                return React.createElement(
                    "div",
                    null,
                    "Loading..."
                );
            } else {
                return React.createElement(EventElements, { data: data });
            }
        }
    }]);

    return EventsComponent;
}(React.Component);

ReactDOM.render(React.createElement(EventsComponent, null), document.getElementById('events-overview'));