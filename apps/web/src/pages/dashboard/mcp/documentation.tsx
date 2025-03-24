import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  HStack,
  Select,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Divider,
  IconButton,
} from '@chakra-ui/react';
import { FiSave, FiEye, FiEdit, FiPlus, FiTrash, FiCode, FiFileText, FiCheckCircle, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import MainLayout from '../../../components/layout/MainLayout';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// Document section interface
interface DocumentSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

// MCP Documentation interface
interface MCPDocumentation {
  _id: string;
  mcpId: string;
  version: string;
  sections: DocumentSection[];
  updatedAt: string;
  createdAt: string;
}

// MCP interface
interface MCP {
  _id: string;
  name: string;
  description: string;
  version: string;
}

const DocumentationPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const toast = useToast();
  const { mcpId } = router.query;

  const [mcp, setMcp] = useState<MCP | null>(null);
  const [documentation, setDocumentation] = useState<MCPDocumentation | null>(null);
  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // New section template
  const newSectionTemplate: DocumentSection = {
    id: '',
    title: '',
    content: '',
    order: 0,
  };

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch MCP and documentation data
  useEffect(() => {
    const fetchData = async () => {
      if (!mcpId || !session) return;

      try {
        setLoading(true);
        
        // Fetch MCP details
        const mcpResponse = await axios.get(`/api/mcp/${mcpId}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        
        setMcp(mcpResponse.data.data);
        
        // Fetch MCP versions
        const versionsResponse = await axios.get(`/api/mcp/${mcpId}/versions`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        
        const versionsList = versionsResponse.data.data.map((v: any) => v.version);
        setVersions(versionsList);
        
        // Set current version as default
        if (mcpResponse.data.data.version) {
          setSelectedVersion(mcpResponse.data.data.version);
          
          // Fetch documentation for current version
          try {
            const docResponse = await axios.get(`/api/mcp/${mcpId}/documentation/${mcpResponse.data.data.version}`, {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            });
            
            setDocumentation(docResponse.data.data);
          } catch (docErr: any) {
            if (docErr.response?.status === 404) {
              // Documentation doesn't exist yet
              setDocumentation({
                _id: '',
                mcpId: mcpId as string,
                version: mcpResponse.data.data.version,
                sections: [
                  {
                    id: `section-${Date.now()}`,
                    title: 'Introduction',
                    content: 'Add an introduction to your MCP...',
                    order: 0,
                  },
                  {
                    id: `section-${Date.now() + 1}`,
                    title: 'Getting Started',
                    content: 'Explain how to get started with your MCP...',
                    order: 1,
                  },
                  {
                    id: `section-${Date.now() + 2}`,
                    title: 'API Reference',
                    content: 'Document your MCP API endpoints...',
                    order: 2,
                  },
                ],
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
              });
              setIsEditing(true);
            } else {
              console.error('Error fetching documentation:', docErr);
              setError(docErr.response?.data?.message || 'Failed to load documentation');
            }
          }
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching MCP data:', err);
        setError(err.response?.data?.message || 'Failed to load MCP data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mcpId, session]);

  // Fetch documentation when selected version changes
  useEffect(() => {
    const fetchDocForVersion = async () => {
      if (!mcpId || !session || !selectedVersion) return;

      try {
        setLoading(true);
        
        // Fetch documentation for selected version
        try {
          const docResponse = await axios.get(`/api/mcp/${mcpId}/documentation/${selectedVersion}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          
          setDocumentation(docResponse.data.data);
          setIsEditing(false);
          setIsPreview(false);
        } catch (docErr: any) {
          if (docErr.response?.status === 404) {
            // Documentation doesn't exist yet for this version
            setDocumentation({
              _id: '',
              mcpId: mcpId as string,
              version: selectedVersion,
              sections: [
                {
                  id: `section-${Date.now()}`,
                  title: 'Introduction',
                  content: 'Add an introduction to your MCP...',
                  order: 0,
                },
                {
                  id: `section-${Date.now() + 1}`,
                  title: 'Getting Started',
                  content: 'Explain how to get started with your MCP...',
                  order: 1,
                },
                {
                  id: `section-${Date.now() + 2}`,
                  title: 'API Reference',
                  content: 'Document your MCP API endpoints...',
                  order: 2,
                },
              ],
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            });
            setIsEditing(true);
          } else {
            console.error('Error fetching documentation:', docErr);
            setError(docErr.response?.data?.message || 'Failed to load documentation');
          }
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.response?.data?.message || 'Failed to load documentation');
      } finally {
        setLoading(false);
      }
    };

    fetchDocForVersion();
  }, [selectedVersion, mcpId, session]);

  // Handle version change
  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVersion(e.target.value);
  };

  // Add a new section
  const addSection = () => {
    if (!documentation) return;
    
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      content: 'Add content here...',
      order: documentation.sections.length,
    };
    
    setDocumentation({
      ...documentation,
      sections: [...documentation.sections, newSection],
    });
  };

  // Remove a section
  const removeSection = (sectionId: string) => {
    if (!documentation) return;
    
    const updatedSections = documentation.sections.filter(
      section => section.id !== sectionId
    );
    
    // Update order of remaining sections
    const reorderedSections = updatedSections.map((section, index) => ({
      ...section,
      order: index,
    }));
    
    setDocumentation({
      ...documentation,
      sections: reorderedSections,
    });
  };

  // Update a section
  const updateSection = (sectionId: string, field: 'title' | 'content', value: string) => {
    if (!documentation) return;
    
    const updatedSections = documentation.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          [field]: value,
        };
      }
      return section;
    });
    
    setDocumentation({
      ...documentation,
      sections: updatedSections,
    });
  };

  // Move section up or down
  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!documentation) return;
    
    const sectionIndex = documentation.sections.findIndex(
      section => section.id === sectionId
    );
    
    if (sectionIndex === -1) return;
    
    const newSections = [...documentation.sections];
    
    if (direction === 'up' && sectionIndex > 0) {
      // Swap with the section above
      const temp = newSections[sectionIndex];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex - 1],
        order: sectionIndex,
      };
      newSections[sectionIndex - 1] = {
        ...temp,
        order: sectionIndex - 1,
      };
    } else if (direction === 'down' && sectionIndex < newSections.length - 1) {
      // Swap with the section below
      const temp = newSections[sectionIndex];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex + 1],
        order: sectionIndex,
      };
      newSections[sectionIndex + 1] = {
        ...temp,
        order: sectionIndex + 1,
      };
    }
    
    setDocumentation({
      ...documentation,
      sections: newSections,
    });
  };

  // Save documentation
  const saveDocumentation = async () => {
    if (!documentation || !mcpId || !session) return;
    
    try {
      setSaving(true);
      
      const method = documentation._id ? 'put' : 'post';
      const endpoint = documentation._id 
        ? `/api/mcp/${mcpId}/documentation/${selectedVersion}`
        : `/api/mcp/${mcpId}/documentation`;
      
      const response = await axios({
        method,
        url: endpoint,
        data: {
          version: selectedVersion,
          sections: documentation.sections,
        },
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      
      setDocumentation(response.data.data);
      setIsEditing(false);
      
      toast({
        title: 'Documentation saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      console.error('Error saving documentation:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to save documentation',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setIsPreview(false);
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    setIsPreview(!isPreview);
  };

  if (status === 'loading' || loading) {
    return (
      <MainLayout>
        <Flex justify="center" align="center" h="60vh">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box p={4}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">MCP Documentation: {mcp?.name}</Heading>
          <HStack spacing={4}>
            {!isEditing ? (
              <Button 
                leftIcon={<FiEdit />} 
                colorScheme="blue" 
                onClick={toggleEditMode}
              >
                Edit Documentation
              </Button>
            ) : (
              <>
                <Button 
                  leftIcon={<FiEye />} 
                  colorScheme="teal" 
                  onClick={togglePreviewMode}
                >
                  {isPreview ? 'Edit' : 'Preview'}
                </Button>
                <Button 
                  leftIcon={<FiSave />} 
                  colorScheme="green" 
                  onClick={saveDocumentation}
                  isLoading={saving}
                >
                  Save
                </Button>
              </>
            )}
          </HStack>
        </Flex>
        
        {/* Version selector */}
        <Box mb={6}>
          <FormControl>
            <FormLabel>Version</FormLabel>
            <Select 
              value={selectedVersion} 
              onChange={handleVersionChange}
              w="250px"
            >
              {versions.map((version) => (
                <option key={version} value={version}>
                  {version} {version === mcp?.version ? '(Current)' : ''}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* Documentation content */}
        {documentation ? (
          <Box>
            {isEditing ? (
              <Box>
                {/* Section editor */}
                <Flex justify="space-between" mb={4}>
                  <Heading size="md">Sections</Heading>
                  <Button
                    leftIcon={<FiPlus />}
                    size="sm"
                    onClick={addSection}
                  >
                    Add Section
                  </Button>
                </Flex>
                
                {isPreview ? (
                  // Preview mode
                  <Box>
                    {documentation.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section) => (
                        <Box key={section.id} mb={8}>
                          <Heading size="md" mb={3}>{section.title}</Heading>
                          <Box p={4} borderRadius="md" bg="gray.50">
                            <ReactMarkdown>{section.content}</ReactMarkdown>
                          </Box>
                        </Box>
                      ))}
                  </Box>
                ) : (
                  // Edit mode
                  <VStack spacing={6} align="stretch">
                    {documentation.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section, index) => (
                        <Box
                          key={section.id}
                          borderWidth="1px"
                          borderRadius="md"
                          p={4}
                        >
                          <Flex justify="space-between" mb={2}>
                            <FormControl>
                              <FormLabel>Section Title</FormLabel>
                              <Input
                                value={section.title}
                                onChange={(e) =>
                                  updateSection(section.id, 'title', e.target.value)
                                }
                              />
                            </FormControl>
                            <HStack spacing={1} align="flex-end" mb={2}>
                              <IconButton
                                aria-label="Move section up"
                                icon={<FiArrowUp />}
                                size="sm"
                                isDisabled={index === 0}
                                onClick={() => moveSection(section.id, 'up')}
                              />
                              <IconButton
                                aria-label="Move section down"
                                icon={<FiArrowDown />}
                                size="sm"
                                isDisabled={index === documentation.sections.length - 1}
                                onClick={() => moveSection(section.id, 'down')}
                              />
                              <IconButton
                                aria-label="Remove section"
                                icon={<FiTrash />}
                                size="sm"
                                colorScheme="red"
                                onClick={() => removeSection(section.id)}
                              />
                            </HStack>
                          </Flex>
                          
                          <FormControl mt={3}>
                            <FormLabel>Content (Markdown supported)</FormLabel>
                            <Textarea
                              value={section.content}
                              onChange={(e) =>
                                updateSection(section.id, 'content', e.target.value)
                              }
                              minH="200px"
                            />
                          </FormControl>
                        </Box>
                      ))}
                  </VStack>
                )}
              </Box>
            ) : (
              // View mode
              <Box>
                <VStack spacing={8} align="stretch">
                  {documentation.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                      <Box key={section.id}>
                        <Heading size="md" mb={3}>{section.title}</Heading>
                        <Box>
                          <ReactMarkdown>{section.content}</ReactMarkdown>
                        </Box>
                        <Divider mt={4} />
                      </Box>
                    ))}
                </VStack>
              </Box>
            )}
          </Box>
        ) : (
          <Alert status="info">
            <AlertIcon />
            <Text>No documentation found for this version. Click Edit to create documentation.</Text>
          </Alert>
        )}
      </Box>
    </MainLayout>
  );
};

export default DocumentationPage; 