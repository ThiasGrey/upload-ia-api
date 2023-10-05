import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import prisma from "../lib/prisma";

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {

    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1_000_000 * 25,

        }
    });

    app.post('/videos',  async (request, reply) => { 
        
        const data = await request.file();

        if (!data) {
            reply.status(400);
            return { error: 'No file uploaded' };
        }

        const extension = path.extname(data.filename);

        if (extension !== '.mp3') {
            reply.status(400);
            return { error: 'File must be an mp3' };
        }

        const fileBaseName = path.basename(data.filename, extension);
        const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

        const uploadDestinantion = path.resolve(__dirname, '..', '..', 'tmp', fileUploadName); 

        await pump(data.file, fs.createWriteStream(uploadDestinantion));

        const video = await prisma.video.create({
            data: {
                name: data.filename,
                path: uploadDestinantion
            }
        });

        return {
            video
        }
    })
}