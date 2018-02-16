import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { world } from './cities/cities';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

import Ymap from './components/ymap.js';

import PropTypes from 'prop-types';

const EXCEPTIONS = ['ь', 'ъ', 'ы', 'й'];
let sortedWorld = world.sort();

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
  board: {
    overflow: 'scroll',
  }
});

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      city: '',
      cities: ['Минск', 'Казань', 'Нижний Новгород'],
      danse: true,
      secondary: false,
      openSnack: false,
      message: '',
      prevCity: 'Нижний Новгород',
      player: true
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  checkByRules(prev = '', next = '') {
    let lastLetterPos;
    if (prev.length === 0) {
      return true;
    }

    if (EXCEPTIONS.includes(prev[prev.length - 1])) {
      lastLetterPos = 2;
    } else {
      lastLetterPos = 1;
    }

    if (prev[prev.length - lastLetterPos].toLowerCase() === next[0].toLowerCase()) {
      return true;
    }

    return false;
  }

  onSubmit(e) {
    e.preventDefault();

    let cities = this.state.cities;
    let city = this.state.city;
    let prevCity = this.state.prevCity;

    if (city.length === 0) {
      this.setState({
        message: `Название города не должно быть пустым!`,
        openSnack: true
      });

      return;
    }

    // check first City letter

    if (!this.checkByRules(prevCity, city)) {
      this.setState({
        message: `${city} начинается не с той буквы!`,
        openSnack: true,
        city: ''
      });

      return;
    }

    // check City already used

    if (cities.includes(city)) {
      this.setState({
        message: `${city} уже был!`,
        openSnack: true,
        city: ''
      });

      return;
    }

    // check City exists

    if (!sortedWorld.includes(city)) {
      this.setState({
        message: `${city} отсутствует в списке городов`,
        openSnack: true,
        city: ''
      });

      return;
    }

    cities.push(city);
    prevCity = city;
    city = '';

    this.setState({
      cities,
      city,
      prevCity,
      player: false
    });

    const availableCities = sortedWorld.filter((element) => {
      if (this.checkByRules(prevCity, element) && !cities.includes(element)) {
        return true;
      } else {
        return false;
      }
    });

    if (availableCities.length > 0) {
      prevCity = availableCities[0];
      cities.push(prevCity);

      this.setState({
        cities,
        prevCity,
        player: true
      });
    }

    console.log(availableCities);

  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleClose(e, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      openSnack: false,
      message: ''
    });
  };

  render() {

    const { classes } = this.props;

    return (
      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Игра "Города"</h1>
        </header>

        <form onSubmit={this.onSubmit}>
          <TextField
            id="cityInput"
            label="Введи название города"
            placeholder="Город"
            className={classes.textField}
            margin="normal"
            onChange={this.onChange}
            value={this.state.city}
            name="city"
            disabled={!this.state.player}
          />
          <Button 
            variant="raised" 
            color="primary"
            type="submit"
            disabled={!this.state.player}>
            Сделать ход
          </Button>
        </form>

        <List dense={this.state.danse} className="board">

          {this.state.cities.map((city, id) => {
            return (<ListItem key={id}>
                      <ListItemText
                        primary={city}
                        secondary={this.state.secondary ? 'Secondary text' : null}
                      />
                    </ListItem>)
          })}

        </List>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.openSnack}
          autoHideDuration={6000}
          onClose={this.handleClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />

        <Ymap />
        
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);