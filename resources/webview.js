import './debugger'

// Disable the context menu to have a more native feel
if (process.env.NODE_ENV === 'production') {
  document.addEventListener('contextmenu', e => e.preventDefault())
}
