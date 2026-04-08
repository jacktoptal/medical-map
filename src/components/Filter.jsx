import { Component } from 'react';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

const MenuProps = {
  PaperProps: {
    sx: {
      maxHeight: '90vh',
      width: 340,
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
    const selectedCount = this.state.selectedSpecialties.length;
    return (
      <aside className="w-full shrink-0 rounded-2xl border border-white/60 bg-white/80 shadow-sm backdrop-blur min-[1281px]:w-[360px]">
        <div className="border-b border-slate-200/70 px-4 py-4">
          <Typography className="text-sm font-semibold text-slate-900 md:text-base">Provider Filters</Typography>
          <Typography className="mt-1 text-xs text-slate-600">
            Narrow down visible providers by medical specialty.
          </Typography>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip size="small" label={`Showing ${this.props.visibleProviders ?? 0}`} color="primary" />
            <Chip
              size="small"
              variant="outlined"
              label={`Total ${this.props.totalProviders ?? 0}`}
              sx={{ borderColor: '#cbd5e1', color: '#334155' }}
            />
          </div>
        </div>

        <List className="px-2 py-3">
          <ListItem disablePadding={false}>
            <div className="w-full">
              <Typography className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500" component="span">
                Treating Providers
              </Typography>
              <Select
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white"
                labelId="select-spec"
                id="select-spec"
                multiple
                value={this.state.selectedSpecialties}
                onChange={this.onChangeSpecialty.bind(this)}
                input={<Input disableUnderline className="px-3 py-2" />}
                renderValue={() => `${selectedCount} selected`}
                MenuProps={MenuProps}
              >
                {this.props.Specialties.map((el) => (
                  <MenuItem key={el} value={el}>
                    <Checkbox
                      checked={this.state.selectedSpecialties.indexOf(el) > -1}
                      sx={{
                        color: 'rgba(0, 0, 0, 0.38)',
                        '&.Mui-checked': {
                          color: '#2563eb',
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
      </aside>
    );
  }
}

export default Filter;
