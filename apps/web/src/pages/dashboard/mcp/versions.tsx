import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { 
  Flex, 
  Box, 
  Heading, 
  Button, 
  VStack, 
  HStack, 
  Text, 
  Badge, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { FiPlus, FiTag, FiCalendar, FiCode, FiCheck, FiX } from 'react-icons/fi';
import MainLayout from '../../../components/layout/MainLayout';
import { format } from 'date-fns';
import axios from 'axios';

// Version interface
interface Version {
  _id: string;
  version: string;
  description: string;
  changeNotes?: string;
  createdAt: string;
  updatedAt: string;
  isCurrentVersion: boolean;
}

// MCP interface
interface MCP {
  _id: string;
  name: string;
  description: string;
  version: string;
  owner: {
    _id: string;
    name: string;
  };
}

const VersionsPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { mcpId } = router.query;

  const [mcp, setMcp] = useState<MCP | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [compareVersions, setCompareVersions] = useState<{
    version1: string | null;
    version2: string | null;
  }>({
    version1: null,
    version2: null,
  });

  // New version form state
  const [newVersion, setNewVersion] = useState({
    version: '',
    description: '',
    changeNotes: '',
    apiSchema: '',
    implementationCode: '',
  });

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch MCP data and versions
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
        
        // Fetch versions
        const versionsResponse = await axios.get(`/api/mcp/${mcpId}/versions`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        
        // Map and mark current version
        const versionsWithCurrentFlag = versionsResponse.data.data.map(
          (version: Version) => ({
            ...version,
            isCurrentVersion: version.version === mcpResponse.data.data.version,
          })
        );
        
        setVersions(versionsWithCurrentFlag);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching MCP and versions:', err);
        setError(err.response?.data?.message || 'Failed to load MCP data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mcpId, session]);

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewVersion({
      ...newVersion,
      [name]: value,
    });
  };

  // Create new version
  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mcpId || !session) return;
    
    try {
      const response = await axios.post(
        `/api/mcp/${mcpId}/versions`,
        newVersion,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      
      // Refresh versions list
      const updatedVersions = [
        {
          ...response.data.data,
          isCurrentVersion: true,
        },
        ...versions.map(v => ({
          ...v,
          isCurrentVersion: false,
        })),
      ];
      
      setVersions(updatedVersions);
      
      // Update MCP current version
      setMcp(prev => prev ? { ...prev, version: newVersion.version } : null);
      
      // Reset form
      setNewVersion({
        version: '',
        description: '',
        changeNotes: '',
        apiSchema: '',
        implementationCode: '',
      });
      
      onClose();
      
      toast({
        title: 'Success',
        description: `Version ${newVersion.version} created successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err: any) {
      console.error('Error creating version:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create version',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Select version for details view
  const handleSelectVersion = (version: Version) => {
    setSelectedVersion(version);
  };

  // Handle version comparison selection
  const handleCompareChange = (versionKey: 'version1' | 'version2', versionId: string) => {
    setCompareVersions({
      ...compareVersions,
      [versionKey]: versionId,
    });
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
          <Heading size="lg">MCP Versions: {mcp?.name}</Heading>
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="blue" 
            onClick={onOpen}
          >
            Create New Version
          </Button>
        </Flex>
        
        {/* Current Version Badge */}
        {mcp && (
          <Flex align="center" mb={4}>
            <Text fontWeight="bold" mr={2}>Current Version:</Text>
            <Badge colorScheme="green" fontSize="md" px={2} py={1}>
              {mcp.version}
            </Badge>
          </Flex>
        )}
        
        {/* Tabs for different views */}
        <Tabs variant="enclosed" mt={4}>
          <TabList>
            <Tab>Version History</Tab>
            <Tab>Version Details</Tab>
            <Tab>Compare Versions</Tab>
          </TabList>
          
          <TabPanels>
            {/* Version History List */}
            <TabPanel>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Version</Th>
                    <Th>Description</Th>
                    <Th>Created At</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {versions.map((version) => (
                    <Tr key={version._id}>
                      <Td>
                        <HStack>
                          <Icon as={FiTag} />
                          <Text>{version.version}</Text>
                        </HStack>
                      </Td>
                      <Td>{version.description}</Td>
                      <Td>
                        <HStack>
                          <Icon as={FiCalendar} />
                          <Text>{format(new Date(version.createdAt), 'MMM dd, yyyy')}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        {version.isCurrentVersion ? (
                          <Badge colorScheme="green">Current</Badge>
                        ) : (
                          <Badge colorScheme="gray">Historical</Badge>
                        )}
                      </Td>
                      <Td>
                        <Button 
                          size="sm" 
                          colorScheme="blue" 
                          onClick={() => handleSelectVersion(version)}
                        >
                          View Details
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              
              {versions.length === 0 && (
                <Box textAlign="center" p={4}>
                  <Text>No versions found. Create your first version!</Text>
                </Box>
              )}
            </TabPanel>
            
            {/* Version Details */}
            <TabPanel>
              {selectedVersion ? (
                <Box border="1px" borderColor="gray.200" borderRadius="md" p={4}>
                  <Heading size="md" mb={4}>{selectedVersion.version}</Heading>
                  
                  <VStack align="start" spacing={4}>
                    <Box>
                      <Text fontWeight="bold" mb={1}>Description</Text>
                      <Text>{selectedVersion.description}</Text>
                    </Box>
                    
                    {selectedVersion.changeNotes && (
                      <Box>
                        <Text fontWeight="bold" mb={1}>Change Notes</Text>
                        <Text whiteSpace="pre-wrap">{selectedVersion.changeNotes}</Text>
                      </Box>
                    )}
                    
                    <Box>
                      <Text fontWeight="bold" mb={1}>Created</Text>
                      <Text>{format(new Date(selectedVersion.createdAt), 'PPpp')}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold" mb={1}>Status</Text>
                      {selectedVersion.isCurrentVersion ? (
                        <Badge colorScheme="green">Current Version</Badge>
                      ) : (
                        <Badge colorScheme="gray">Historical Version</Badge>
                      )}
                    </Box>
                  </VStack>
                </Box>
              ) : (
                <Box textAlign="center" p={4}>
                  <Text>Select a version from the Version History tab to view details</Text>
                </Box>
              )}
            </TabPanel>
            
            {/* Compare Versions */}
            <TabPanel>
              <Box mb={4}>
                <Text mb={2}>Select two versions to compare:</Text>
                <HStack spacing={4}>
                  <FormControl w="200px">
                    <FormLabel>Version 1</FormLabel>
                    <select 
                      value={compareVersions.version1 || ''} 
                      onChange={(e) => handleCompareChange('version1', e.target.value)}
                      className="chakra-select"
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #E2E8F0' }}
                    >
                      <option value="">Select version</option>
                      {versions.map((v) => (
                        <option key={v._id} value={v.version}>
                          {v.version}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  
                  <FormControl w="200px">
                    <FormLabel>Version 2</FormLabel>
                    <select 
                      value={compareVersions.version2 || ''} 
                      onChange={(e) => handleCompareChange('version2', e.target.value)}
                      className="chakra-select"
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #E2E8F0' }}
                    >
                      <option value="">Select version</option>
                      {versions.map((v) => (
                        <option key={v._id} value={v.version}>
                          {v.version}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                </HStack>
              </Box>
              
              {compareVersions.version1 && compareVersions.version2 ? (
                <Box border="1px" borderColor="gray.200" borderRadius="md" p={4}>
                  <Heading size="md" mb={4}>
                    Comparing {compareVersions.version1} with {compareVersions.version2}
                  </Heading>
                  
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Feature</Th>
                        <Th>{compareVersions.version1}</Th>
                        <Th>{compareVersions.version2}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {/* Here you would display the actual comparison data */}
                      <Tr>
                        <Td>Description</Td>
                        <Td>{versions.find(v => v.version === compareVersions.version1)?.description}</Td>
                        <Td>{versions.find(v => v.version === compareVersions.version2)?.description}</Td>
                      </Tr>
                      <Tr>
                        <Td>Created At</Td>
                        <Td>
                          {versions.find(v => v.version === compareVersions.version1)?.createdAt &&
                            format(new Date(versions.find(v => v.version === compareVersions.version1)?.createdAt || ''), 'MMM dd, yyyy')}
                        </Td>
                        <Td>
                          {versions.find(v => v.version === compareVersions.version2)?.createdAt &&
                            format(new Date(versions.find(v => v.version === compareVersions.version2)?.createdAt || ''), 'MMM dd, yyyy')}
                        </Td>
                      </Tr>
                      {/* Add more comparison rows as needed */}
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <Box textAlign="center" p={4}>
                  <Text>Select two versions to compare them</Text>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      {/* Create New Version Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Version</ModalHeader>
          <ModalCloseButton />
          
          <form onSubmit={handleCreateVersion}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Version (Semantic Versioning)</FormLabel>
                  <Input 
                    name="version" 
                    placeholder="e.g., 1.0.0" 
                    value={newVersion.version}
                    onChange={handleFormChange}
                    pattern="^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$"
                    title="Please use semantic versioning (e.g., 1.0.0)"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea 
                    name="description" 
                    placeholder="What's new in this version?" 
                    value={newVersion.description}
                    onChange={handleFormChange}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Change Notes</FormLabel>
                  <Textarea 
                    name="changeNotes" 
                    placeholder="Detailed list of changes (optional)" 
                    value={newVersion.changeNotes}
                    onChange={handleFormChange}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>API Schema</FormLabel>
                  <Textarea 
                    name="apiSchema" 
                    placeholder="API Schema in JSON format" 
                    value={newVersion.apiSchema}
                    onChange={handleFormChange}
                    h="150px"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Implementation Code</FormLabel>
                  <Textarea 
                    name="implementationCode" 
                    placeholder="Implementation code" 
                    value={newVersion.implementationCode}
                    onChange={handleFormChange}
                    h="150px"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue">
                Create Version
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
};

export default VersionsPage; 