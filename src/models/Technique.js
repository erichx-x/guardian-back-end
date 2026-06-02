const mongoose = require('mongoose');

const techniqueSchema = new mongoose.Schema(
  {
    technique: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    video: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

techniqueSchema.index(
  { technique: 'text', category: 'text', description: 'text' },
  { weights: { technique: 5, category: 3, description: 2 }, name: 'TechniqueTextIndex' }
);

techniqueSchema.set('toJSON', {
  transform(_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Technique', techniqueSchema);
