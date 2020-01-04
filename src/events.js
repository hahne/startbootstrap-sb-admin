var update_event_overview = false;

class EnrollComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: []
        };
    }

    fetch_enroll()
    {
        var data = new FormData();
        data.append( "event_id", this.props.event_id );
        data.append( "appointment_id", this.props.appointment_id );
        data.append( "deregister", this.props.deregister ? 1 : 0 );

        const EnrollInit = {
            method: 'POST',
            cache: 'reload',
            credentials: 'include',
            mode: 'cors',
            referrerPolicy: 'no-referrer-when-downgrade',
            body: data
        };

        fetch("https://mobile.svfreihausen.de/ws/enroll_webservice.php", EnrollInit)
        .then(res => res.json())
        .then(
        (result) => {
            this.setState({
            isLoaded: true,
            data: result
            });
        },
        (error) => {
            this.setState({
            isLoaded: true,
            error
            });
        }
        )
    }

    componentDidMount() {
        this.fetch_enroll();
    }

    componentDidUpdate(prevProps) {
        if (this.props.event_id !== prevProps.event_id || 
            this.props.appointment_id !== prevProps.appointment_id ||
            this.props.deregister !== prevProps.deregister)
        {
            this.fetch_enroll();
        }
    }

    render() {
        update_event_overview = true;
        ReactDOM.render(
            <EventsComponent />,
            document.getElementById('events-overview')
        );

        const { error, isLoaded, data } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            
            if(data.error_code == 0)
            {
                enroll_action = "angemeldet";
                if(data.deregister)
                {
                    enroll_action = "abgemeldet";
                }
                return (
                    <div>
                        <p>Sie haben sich für folgenden Termin {enroll_action}:</p>
                        <p><strong>Veranstaltung:</strong> {data.name}<br />
                        <strong>Datum / Zeit:</strong> {data.datetime}</p>
                    </div>
                );
            }
            else
            {
                return (
                    <div>
                        <p>{data.error_message}</p>
                    </div>
                );
            }
        }
    }


}

class ParticipantsComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        data: []
      };
    }

    fetch_participants()
    {
        var data = new FormData();
        data.append( "event_id", this.props.event_id );
        data.append( "appointment_id", this.props.appointment_id );

        const ParticipantsInit = {
            method: 'POST',
            cache: 'reload',
            credentials: 'include',
            mode: 'cors',
            referrerPolicy: 'no-referrer-when-downgrade',
            body: data
        };

        fetch("https://mobile.svfreihausen.de/ws/participants_webservice.php", ParticipantsInit)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              data: result
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }

    componentDidMount() {
        this.fetch_participants();
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.event_id !== prevProps.event_id || this.props.appointment_id !== prevProps.appointment_id) {
            this.fetch_participants();
        }
    }

    render() {
        const { error, isLoaded, data } = this.state;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
          return (
              <ListParticipants data={data} />
          );
        }
    }
}

function ListParticipants(props)
{
    if(props.data.error_code == 0)
    {
        attendeesItems = <li>-/-</li>;
        waitlistItems = <li>-/-</li>;

        visible_attendees = props.data.visible_attendees;
        visible_waitlist = props.data.visible_waitlist;

        if(visible_attendees) {
            attendeesItems = visible_attendees.map((attendee) =>
                <li>{attendee}</li>
            );
        }
        
        if(visible_waitlist) {
            waitlistItems = visible_waitlist.map((attendee) =>
                <li>{attendee}</li>
            );
        }
        return (
            <div>
                <p><strong>Veranstaltung:</strong> {props.data.name}<br />
                <strong>Datum / Zeit:</strong> {props.data.datetime}</p>
                <h6>Teilnehmer:</h6>
                <ul>
                    {attendeesItems}
                    <li>+{props.data.hidden_attendees} weitere Teilnehmer.</li>
                </ul>
                <h6>Auf der Warteliste:</h6>
                <ul>
                    {waitlistItems}
                    <li>+{props.data.hidden_waitlist} weitere Teilnehmer.</li>
                </ul>
            </div>
        );
    }
    else
    {
        return (
            <div><p>{props.data.error_message}</p></div>
        );
    }
}


function EventInfo(props) {
  return (
    <div class="my-3">
        <h2 id={"event_" + props.event_id} >{props.name}</h2>

        <div class="row no-gutters">
        <div class="col-sm-2 font-italic text-nowrap">
            Leiter:
        </div>
        <div class="col-md-auto">
            {props.organiser}
        </div>
        </div>
        <div class="row no-gutters">
        <div class="col-sm-2 font-italic text-nowrap">
            E-Mail:
        </div>
        <div class="col-md-auto">
            {props.email}
        </div>
        </div>
        <div class="row no-gutters">
        <div class="col-sm-2 font-italic text-nowrap">
            Infos:
        </div>
        <div class="col-md-auto">
            {props.info}
        </div>
        </div>
    </div>
   );
}

class TermElement extends React.Component {

    UpdateParticipantList(event_id, appointment_id)
    {
        ReactDOM.render(
            <ParticipantsComponent event_id={event_id} appointment_id={appointment_id}  />,
            document.getElementById('ParticipantsContainer')
        );
    }

    EnrollEvent(event_id, appointment_id, deregister)
    {
        ReactDOM.render(
            <EnrollComponent event_id={event_id} appointment_id={appointment_id}
                deregister={deregister}  />,
            document.getElementById('EnrollModalContainer')
        );
    }

    render() {
        appointment = this.props.appointment;
        bgClass = "card bg-secondary o-hidden h-100";
        bgImage = "fas fa-fw fa-calendar-alt";
        termAction = "Anmelden";
        termFull = appointment.num_attendees >= this.props.max_attendees;
        if(termFull)
        {
            bgClass = "card bg-warning o-hidden h-100";
            bgImage = "fas fa-fw fa-calendar-alt";
            termAction = "In Warteliste eintragen";
        }
        if(appointment.user_attendance)
        {
            bgClass = "card bg-success o-hidden h-100";
            bgImage = "fas fa-fw fa-check";
            termAction = "Abmelden";
            
            if(appointment.on_wait_list)
            {
                bgClass = "card bg-danger o-hidden h-100";
                bgImage = "fas fa-fw fa-history";
                termAction = "Von Warteliste Abmelden";
            }
        }
        return (
            <div class="col-xl-3 col-sm-6 mb-3">
            <div class={bgClass}>
                <div class="card-body">
                <div class="card-body-icon">
                    <i class={bgImage}></i>
                </div>
                <div class="mr-5">
                    <span class="clearfix" >{appointment.datetime}:</span>
                    <span class="small clearfix" >{appointment.num_attendees} von {this.props.max_attendees} Teilnehmerplätze belegt.</span>
                    <button key={appointment.appointment_id} onClick={(e) => this.UpdateParticipantList(this.props.event_id, this.props.appointment.appointment_id, e)} class="btn btn-outline-primary btn-sm clearfix" type="button" data-toggle="modal" data-target="#ParticipantsList">
                    Teilnehmerliste
                    </button>
                </div>
                </div>
                <a onClick={(e) => this.EnrollEvent(this.props.event_id, this.props.appointment.appointment_id, this.props.appointment.user_attendance, e)} href="#" class="card-footer clearfix small z-1" data-toggle="modal" data-target="#EnrollModal">
                    <span class="float-left">{termAction}</span>
                    <span class="float-right">
                        <i class="fas fa-angle-right"></i>
                    </span>
                </a>
            </div>
        </div>
        );
    }
}

function TermElements(props) {
    appointments = props.appointments;
    const termItems = appointments.map((appointment) =>
        <TermElement appointment={appointment} max_attendees={props.max_attendees}
        event_id={props.event_id} />
    );
    return (
        <div class="row">{termItems}</div>
    );
}

function EventElement(props) {
    events = props.data;
    return (
        <div>
            <EventInfo event_id={events.event_id}
            name={events.name}
            organiser={events.organiser}
            email={events.email}
            info={events.info}
            max_attendees={events.max_attendees} />
            <TermElements appointments={events.appointments}
                max_attendees={events.max_attendees}
                event_id={events.event_id} />
        </div>
    );
}

function EventNavElement(props) {
    return (
        <a class="dropdown-item" href={"#event_" + props.data.event_id}>{props.data.name}</a>
    );
}

function RenderEventNav(events) {
    ReactDOM.render(
        events.map((eventItem) =>
            <EventNavElement data={eventItem} />
        ),
        document.getElementById('event-nav')
    );
}

function EventElements(props) {
    if(!props.data.logged_in)
    {
        window.location.replace("login.html");
        return (<p>Sie müssen sich erst einloggen!</p>);
    }

    if(!props.data.access_permission)
    {
        return (<p>Sie haben nicht die notwendigen Rechte für diesen Bereich!</p>);
    }

    if(props.data.error_code != 0)
    {
        return (<p>{props.data.error_message}</p>);
    }

    const eventItems = props.data.events.map((eventItem) =>
        <EventElement data={eventItem} />
    );

    RenderEventNav(props.data.events)

    return (<div>{eventItems}</div>);
}

const EventsComponentInit = {
    method: 'GET',
    cache: 'reload',
    credentials: 'include',
    mode: 'cors',
    referrerPolicy: 'no-referrer-when-downgrade'
  };

class EventsComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        data: []
      };
    }

    fetch_events() {
        fetch("https://mobile.svfreihausen.de/ws/events_webservice.php", EventsComponentInit)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              data: result
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
  
    componentDidMount() {
        update_event_overview = false;
        this.fetch_events();
    }

    componentDidUpdate() {
        if (update_event_overview) {
            update_event_overview = false;
            this.fetch_events();
        }
    }
  
    render() {
        const { error, isLoaded, data } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <EventElements data={data} />
            );
        }
    }
  }

ReactDOM.render(
  <EventsComponent />,
  document.getElementById('events-overview')
);