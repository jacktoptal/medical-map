import { Component } from 'react';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

const MenuProps = {
  PaperProps: {
    sx: {
      maxHeight: '90vh',
      width: 250,
    },
  },
};

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSpecialties: this.props.Specialties,
    };
  }

  onChangeSpecialty(event) {
    this.props.changeSpecialty(event.target.value);

    this.setState({
      selectedSpecialties: event.target.value,
    });
  }

  render() {
    return (
      <div className="flex flex-1 flex-col bg-white">
        <List>
          <ListItem disablePadding={false}>
            <div className="flex w-full max-w-full">
              <Typography className="w-[150px] shrink-0" component="span">
                Treating Providers
              </Typography>
              <Select
                className="min-w-0 flex-1 bg-[rgb(231,231,231)]"
                labelId="select-spec"
                id="select-spec"
                multiple
                value={this.state.selectedSpecialties}
                onChange={this.onChangeSpecialty.bind(this)}
                input={<Input disableUnderline className="px-2" />}
                renderValue={(selected) => '  ' + selected.length + ' selected'}
                MenuProps={MenuProps}
              >
                {this.props.Specialties.map((el) => (
                  <MenuItem key={el} value={el}>
                    <Checkbox
                      checked={this.state.selectedSpecialties.indexOf(el) > -1}
                      sx={{
                        color: 'rgba(0, 0, 0, 0.54)',
                        '&.Mui-checked': {
                          color: '#1b568b',
                        },
                      }}
                    />
                    <ListItemText primary={el} />
                  </MenuItem>
                ))}
              </Select>
            </div>
          </ListItem>
        </List>
      </div>
    );
  }
}

export default Filter;
