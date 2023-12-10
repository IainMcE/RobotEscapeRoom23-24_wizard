# Import necessary libraries
from flask import Flask, render_template, redirect, request, url_for, session
from flask_session import Session

# Initialize the Flask app
app = Flask(__name__)

app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
app.secret_key = 'RobotEscapeRoomMQP2324'

class StateMachine(object):

    def __init__(self, transitions):
        self.transitions = transitions
        self.states = set()
        for transition in self.transitions:
            self.states.update(transition)
        self.history = []

    def __repr__(self):
        return ('StateMachine(states={states}, '
                'transitions={tns}, history={history})').format(
            states=self.states,
            tns=self.transitions,
            history=self.history,
        )
                            

# --- Flask templates ---         
@app.route('/fsm')
def main():
    return render_template('fsm.html')
                
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)