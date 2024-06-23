"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vertex_ai_1 = require("../src/vertex_ai");
const models_1 = require("../src/models");
const errors_1 = require("../src/types/errors");
const PROJECT = 'test_project';
const LOCATION = 'test_location';
describe('VertexAI', () => {
    let vertexai;
    beforeEach(() => {
        vertexai = new vertex_ai_1.VertexAI({
            project: PROJECT,
            location: LOCATION,
        });
    });
    it('given undefined google auth options, should be instantiated', () => {
        expect(vertexai).toBeInstanceOf(vertex_ai_1.VertexAI);
    });
    it('given specified google auth options, should be instantiated', () => {
        const googleAuthOptions = {
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
        };
        const vetexai1 = new vertex_ai_1.VertexAI({
            project: PROJECT,
            location: LOCATION,
            googleAuthOptions: googleAuthOptions,
        });
        expect(vetexai1).toBeInstanceOf(vertex_ai_1.VertexAI);
    });
    it('given inconsistent project ID, should throw error', () => {
        const googleAuthOptions = {
            projectId: 'another_project',
        };
        expect(() => {
            new vertex_ai_1.VertexAI({
                project: PROJECT,
                location: LOCATION,
                googleAuthOptions: googleAuthOptions,
            });
        }).toThrow(new Error('inconsistent project ID values. argument project got value test_project but googleAuthOptions.projectId got value another_project'));
    });
    it('given scopes missing required scope, should throw GoogleAuthError', () => {
        const invalidGoogleAuthOptionsStringScopes = { scopes: 'test.scopes' };
        expect(() => {
            new vertex_ai_1.VertexAI({
                project: PROJECT,
                location: LOCATION,
                googleAuthOptions: invalidGoogleAuthOptionsStringScopes,
            });
        }).toThrow(new errors_1.GoogleAuthError("input GoogleAuthOptions.scopes test.scopes doesn't contain required scope " +
            'https://www.googleapis.com/auth/cloud-platform, ' +
            'please include https://www.googleapis.com/auth/cloud-platform into GoogleAuthOptions.scopes ' +
            'or leave GoogleAuthOptions.scopes undefined'));
        const invalidGoogleAuthOptionsArrayScopes = {
            scopes: ['test1.scopes', 'test2.scopes'],
        };
        expect(() => {
            new vertex_ai_1.VertexAI({
                project: PROJECT,
                location: LOCATION,
                googleAuthOptions: invalidGoogleAuthOptionsArrayScopes,
            });
        }).toThrow(new errors_1.GoogleAuthError("input GoogleAuthOptions.scopes test1.scopes,test2.scopes doesn't contain required scope " +
            'https://www.googleapis.com/auth/cloud-platform, ' +
            'please include https://www.googleapis.com/auth/cloud-platform into GoogleAuthOptions.scopes ' +
            'or leave GoogleAuthOptions.scopes undefined'));
    });
    it('VertexAIPreview should generate GenerativatModelPreview', () => {
        const generativeModelPreview = vertexai.preview.getGenerativeModel({
            model: 'gemini-pro',
        });
        expect(generativeModelPreview).toBeInstanceOf(models_1.GenerativeModelPreview);
    });
    it('VertexAI should generate GenerativatModel', () => {
        const generativeModel = vertexai.getGenerativeModel({
            model: 'gemini-pro',
        });
        expect(generativeModel).toBeInstanceOf(models_1.GenerativeModel);
    });
});
//# sourceMappingURL=vertex_ai_test.js.map