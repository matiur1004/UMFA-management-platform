export const CONFIRM_MODAL_CONFIG = {
    'title': 'Are you sure?',
    'message': '',
    'icon': {
      'show': true,
      'name': 'heroicons_outline:exclamation',
      'color': 'warn'
    },
    'actions': {
      'cancel': {
        'show': true,
        'label': 'Cancel',
        'color': 'warn'
      },
      'confirm': {
        'show': true,
        'color': 'primary',
        'label': 'Ok'
      }
    },
    'dismissible': true
};

export const ALERT_MODAL_CONFIG = {
  'title': 'Are you sure?',
  'message': '',
  'icon': {
    'show': true,
    'name': 'heroicons_outline:exclamation',
    'color': 'warn'
  },
  'actions': {
    'cancel': {
      'show': false,
      'label': 'Cancel',
      'color': 'warn'
    },
    'confirm': {
      'show': true,
      'color': 'primary',
      'label': 'Ok'
    }
  },
  'dismissible': true
};