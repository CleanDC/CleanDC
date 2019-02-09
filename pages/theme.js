import theme from 'muse-ui/lib/theme'
theme.add('CleanDC', {
  primary: '#00ADEF',
  secondary: '#ff4081',
  success: '#4caf50',
  warning: '#fdd835',
  info: '#00ADEF',
  error: '#f44336',
  track: '#bdbdbd',
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'gba(0, 0, 0, 0.54)',
    alternate: '#fff',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)'
  },
  divider: 'rgba(0, 0, 0, 0.12)',
  background: {
    paper: '#fff',
    chip: '#e0e0e0',
    default: '#fff'
  }
}, 'light')

theme.use('CleanDC')
