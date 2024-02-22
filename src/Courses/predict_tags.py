from transformers import TFAutoModelForTokenClassification as ts, AutoTokenizer, pipeline

tokenizer = AutoTokenizer.from_pretrained('bert-base-cased')

# tf model for NER
model = ts.from_pretrained('dbmdz/bert-large-cased-finetuned-conll03-english', from_pt=True)

# pipeline using tf model
ner_pipeline = pipeline('ner', model=model, tokenizer=tokenizer, framework='tf')

# Predict tags 
description = "This course offers a concise introduction to ethics in computing, distilled from the ethical and social discussions carried on by today's academic and popular commentators. This course covers a wide range of topics within this area including the philosophical framework for analyzing computer ethics; the impact of computer technology on security, privacy and intellectual property, digital divide, and gender and racial discrimination; the ethical tensions with Artificial Intelligence around future of work and humanity, the emerging role of online social media over voice, inclusion, and democracy; and the environmental consequences of computing."
ner_results = ner_pipeline(description)

# Extract entities as tags
tags = [result['word'] for result in ner_results if result['entity_group'] == 'PER' or result['entity_group'] == 'ORG']
print(tags)