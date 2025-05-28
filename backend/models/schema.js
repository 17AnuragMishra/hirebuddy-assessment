const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  job_title: { type: String, required: true },
  company_name: { type: String, required: true },
  job_location: { type: String, required: true },
  apply_link: { type: String, required: true },
  job_description: { type: String, required: true },
  source: { type: String, required: true },
}, {
  indexes: [
    { key: { job_title: 'text', job_description: 'text', company_name: 'text' } }
  ]
});

const searchHistorySchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  count: { type: Number, default: 1 },
  lastSearched: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);
const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

module.exports = { Job, SearchHistory };