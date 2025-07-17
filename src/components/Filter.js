import React, { Component } from 'react';

import './Filter.scss';

import { Picky } from 'react-picky';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSpecialties: this.props.Specialties
        }

    }

    onChangeSpecialty(event) {

        this.props.changeSpecialty(event.target.value);

        this.setState({
            selectedSpecialties: event.target.value
        })
    }

    render() {
        return (
            <div className="filter">
                <List>
                    <ListItem>
                        <div className="filter-item">
                            <Typography className="filter-item-title">
                                Treating Providers
                            </Typography>
                            <Select className="filter-item-value"
                                labelId="select-spec"
                                id="select-spec"
                                multiple
                                value={this.state.selectedSpecialties}
                                onChange={this.onChangeSpecialty.bind(this)}
                                input={<Input className="item-check"/>}
                                renderValue={(selected) => "  " + selected.length + " selected"}
                                MenuProps={MenuProps}
                            >
                                {this.props.Specialties.map((el) => (
                                    <MenuItem key={el} value={el}>
                                        <Checkbox checked={this.state.selectedSpecialties.indexOf(el) > -1} />
                                        <ListItemText primary={el} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </ListItem>
                </List>
            </div >
        );
    }
}

export default Filter;