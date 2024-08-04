const createSpy = jest.fn().mockResolvedValue({
    content: [
        {
            text: 'mock-result-text',
        },
    ],
});
jest.doMock('@anthropic-ai/sdk', () => {
    return jest.fn().mockImplementation(() => {
        return {
            messages: {
                create: createSpy,
            },
        };
    });
});

const {generateClaudeContent} = require('./claudeAi');

describe('claudeAi service', () => {
    afterEach(() => {
        createSpy.mockClear();
    });
    it('should call Anthropic.messages.create with the given args', async () => {
        const mockContent = 'this is a mock content';

        await generateClaudeContent(mockContent);

        expect(createSpy).toHaveBeenCalledWith({
            max_tokens: 4096,
            messages: 'this is a mock content',
            model: 'claude-3-opus-20240229',
        });
    });

    it('should call Anthropic.messages.create with a given model', async () => {
        const mockContent = 'this is a mock content';
        const mockModel = 'claude-3-5-sonnet-20240620';

        await generateClaudeContent(mockContent, mockModel);

        expect(createSpy).toHaveBeenCalledWith({
            max_tokens: 4096,
            messages: 'this is a mock content',
            model: 'claude-3-5-sonnet-20240620',
        });
    });

    it('should console error if something went wrong', async () => {
        const mockContent = 'this is a mock content';
        const mockError = new Error('Something went wrong');
        jest.spyOn(console, 'error');
        createSpy.mockImplementationOnce(() => {
            console.log('throwing :>> ');
            throw mockError;
        });

        await generateClaudeContent(mockContent);
        expect(console.error).toHaveBeenCalledWith('Error in generateClaudeContent:', mockError);
    });
});
