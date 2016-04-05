import Ember from 'ember';
const remote = require('electron').remote

export default Ember.Service.extend({
	getAlbumsByTag: remote.getAlbumsByTag
});
