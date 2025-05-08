// MagicButton.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Typography, Tab, Tabs, Box, Alert, CircularProgress } from '@mui/material';
import { RiMagicLine } from 'react-icons/ri';
import { IoCloseOutline } from 'react-icons/io5';

interface MagicButtonProps {
    onContentGenerated: (content: string) => void;
    buttonText?: string;
    dialogTitle?: string;
    dialogDescription?: string;
    inputPlaceholder?: string;
    modelName?: string;
    useStreaming?: boolean;
    className?: string;
    apiEndpoint?: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function MagicButton({
    onContentGenerated,
    buttonText = "AI Magic",
    dialogTitle = "Tạo nội dung với AI",
    dialogDescription = "Lên ý tưởng để tạo nội dung với AI",
    inputPlaceholder = "Mô tả ý tưởng của bạn...",
    modelName = "llama3.2",
    useStreaming = true,
    className,
    apiEndpoint = "http://localhost:11434/api/generate"
}: MagicButtonProps) {
    const [open, setOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [controller, setController] = useState<AbortController | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Clean up controller on unmount
    useEffect(() => {
        return () => {
            if (controller) {
                controller.abort();
            }
        };
    }, [controller]);

    const generateContent = async () => {
        if (!prompt.trim()) return;

        // Reset content and error
        setGeneratedContent('');
        setError(null);
        setIsGenerating(true);

        // Create a new abort controller
        const abortController = new AbortController();
        setController(abortController);

        try {
            if (useStreaming) {
                // Streaming implementation
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'gemma3',
                        prompt: prompt,
                        stream: true
                    }),
                    signal: abortController.signal
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }

                const reader = response.body?.getReader();

                if (!reader) {
                    throw new Error('Response body reader is not available');
                }

                const decoder = new TextDecoder();
                let accumulatedContent = '';

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        try {
                            const parsedLine = JSON.parse(line);

                            if (parsedLine.response) {
                                accumulatedContent += parsedLine.response;
                                setGeneratedContent(accumulatedContent);
                            }

                            // Check if this is the last message
                            if (parsedLine.done) {
                                break;
                            }
                        } catch (e) {
                            console.error('Error parsing JSON:', e);
                        }
                    }
                }
            } else {
                // Non-streaming implementation
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: modelName,
                        prompt: prompt,
                        stream: false
                    }),
                    signal: abortController.signal
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setGeneratedContent(data.response);
            }
        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                console.log('Request was aborted');
                setError('Generation was canceled');
            } else {
                console.error('Failed to generate content:', error);
                setError(`Failed to generate content: ${(error as Error).message || 'Unknown error'}. 
                Please check if the AI service is running.`);
            }
        } finally {
            setIsGenerating(false);
            setController(null);
        }
    };

    const handleCancelGeneration = () => {
        if (controller) {
            controller.abort();
            setController(null);
            setIsGenerating(false);
        }
    };

    const handleConfirm = () => {
        onContentGenerated(generatedContent);
        setOpen(false);
        // Reset states for next use
        resetState();
    };

    const handleClose = () => {
        if (isGenerating) {
            handleCancelGeneration();
        }
        setOpen(false);
        resetState();
    };

    const resetState = () => {
        setPrompt('');
        setGeneratedContent('');
        setTabValue(0);
        setError(null);
    };

    return (
        <>
            <Button 
                onClick={() => setOpen(true)} 
                variant="contained"
                className={className}
                title="Generate content with AI"
                startIcon={<RiMagicLine />}
                size="small"
            >
                {buttonText}
            </Button>

            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    style: { maxHeight: '80vh' }
                }}
            >
                <DialogTitle>
                    {dialogTitle}
                    <Typography variant="subtitle1" color="text.secondary">
                        {dialogDescription}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" component="label" htmlFor="prompt" sx={{ mb: 1, display: 'block' }}>
                            Your Prompt
                        </Typography>
                        <TextField
                            id="prompt"
                            placeholder={inputPlaceholder}
                            value={prompt}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                            multiline
                            rows={3}
                            fullWidth
                            disabled={isGenerating}
                        />
                        <Button
                            onClick={generateContent}
                            disabled={isGenerating || !prompt.trim()}
                            variant="contained"
                            sx={{ mt: 2 }}
                            startIcon={isGenerating ? <CircularProgress size={20} /> : null}
                        >
                            {isGenerating ? 'Generating...' : 'Generate'}
                        </Button>
                    </Box>

                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ mb: 3 }}
                            action={
                                <Button color="inherit" size="small" onClick={() => setError(null)}>
                                    <IoCloseOutline />
                                </Button>
                            }
                        >
                            <Typography variant="subtitle2">{error}</Typography>
                        </Alert>
                    )}

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1">Generated Content</Typography>
                            {isGenerating && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={handleCancelGeneration}
                                >
                                    Stop Generating
                                </Button>
                            )}
                        </Box>

                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="content tabs">
                                <Tab label="Preview" id="tab-0" aria-controls="tabpanel-0" />
                                <Tab label="Edit" id="tab-1" aria-controls="tabpanel-1" />
                            </Tabs>
                        </Box>
                        
                        <TabPanel value={tabValue} index={0}>
                            <Box sx={{ minHeight: 200, border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                                {isGenerating && !generatedContent && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                        <CircularProgress size={16} sx={{ mr: 1 }} />
                                        <Typography variant="body2">Generating content...</Typography>
                                    </Box>
                                )}
                                {!isGenerating && !generatedContent && !error && (
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                        Generated content will appear here
                                    </Typography>
                                )}
                                {generatedContent && (
                                    <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                                        {generatedContent}
                                    </Typography>
                                )}
                            </Box>
                        </TabPanel>
                        
                        <TabPanel value={tabValue} index={1}>
                            <TextField
                                value={generatedContent}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setGeneratedContent(e.target.value)}
                                placeholder={isGenerating ? "Generating content..." : "Generated content will appear here"}
                                multiline
                                rows={12}
                                fullWidth
                                disabled={isGenerating}
                                sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                            />
                        </TabPanel>
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Button variant="outlined" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {generatedContent && !isGenerating && (
                            <Button onClick={generateContent} variant="outlined">
                                Regenerate
                            </Button>
                        )}
                        {generatedContent && !isGenerating && (
                            <Button onClick={handleConfirm} variant="contained" color="primary">
                                Confirm
                            </Button>
                        )}
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
}