//import Fastify and create a new instance of app
import fastify from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { getAllPromptsRoute } from './routes/get-all-prompts';
import { uploadVideoRoute } from './routes/upload-video';
import { createTranscriptionRoute } from './routes/create-transcription';
import { generateAiCompleteRoute } from './routes/generate-ai-completion';

export const app = fastify();

app.register(fastifyCors, {
    origin: '*'
});

app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generateAiCompleteRoute);


app.listen({
    port: 3333,
}).then(() => {
    console.log('app listening on port 3333');
})


