import { useState, useEffect } from 'react';
import {
    Building2,
    Layers,
    Puzzle,
    BookOpen,
    Plus,
    Trash2,
    Pencil,
    Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api, Faculty, Batch, Section, Subject } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AcademicStructure = () => {
    const { toast } = useToast();

    // State for data
    const [departments, setDepartments] = useState<Faculty[]>([]); // Using Faculty interface but keeping 'departments' var name for UI consistency
    const [batches, setBatches] = useState<Batch[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [filterDept, setFilterDept] = useState('all');
    const [filterBatch, setFilterBatch] = useState('all');

    // Modal States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('departments');
    const [newItemName, setNewItemName] = useState('');
    const [newCode, setNewCode] = useState('');
    const [selectedParentId, setSelectedParentId] = useState('');
    const [dialogDeptId, setDialogDeptId] = useState(''); // For hierarchical selection in modal
    const [searchQuery, setSearchQuery] = useState('');

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState('');

    // Bulk add states
    const [bulkDepartments, setBulkDepartments] = useState('');
    const [bulkSubjects, setBulkSubjects] = useState('');
    const [initialBatch, setInitialBatch] = useState('');
    const [finalBatch, setFinalBatch] = useState('');
    const [initialSection, setInitialSection] = useState('');
    const [finalSection, setFinalSection] = useState('');
    const [isBulkMode, setIsBulkMode] = useState(false);

    // Fetch Data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [deptsData, batchesData, sectionsData, subjectsData] = await Promise.all([
                api.getFaculties(),
                api.getBatches(),
                api.getSections(),
                api.getSubjects()
            ]);
            setDepartments(deptsData);
            setBatches(batchesData);
            setSections(sectionsData);
            setSubjects(subjectsData);
        } catch (error) {
            console.error("Failed to fetch data", error);
            toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTabChange = (val: string) => {
        setActiveTab(val);
        setFilterDept('all');
        setFilterBatch('all');
        setSelectedParentId('');
        setNewItemName('');
        setNewCode('');
        setSearchQuery('');
    };

    const handleEdit = (type: string, item: any) => {
        setIsEditMode(true);
        setEditId(item.id);
        setNewItemName(item.name);

        // Pre-fill parent selections based on item type
        if (type === 'batches') {
            setSelectedParentId(item.faculty_id);
        } else if (type === 'sections') {
            const batch = batches.find(b => b.id === item.batch_id);
            if (batch) {
                setDialogDeptId(batch.faculty_id);
                setSelectedParentId(item.batch_id);
            }
        } else if (type === 'subjects') {
            setNewCode(item.code || '');
            const section = sections.find(s => s.id === item.section_id);
            if (section) {
                const batch = batches.find(b => b.id === section.batch_id);
                if (batch) {
                    setDialogDeptId(batch.faculty_id);
                    setSelectedParentId(batch.id);
                }
            }
        }

        setIsDialogOpen(true);
    };

    const handleAdd = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            if (isEditMode && editId) {
                // Handle Update
                let updateData: any = { name: newItemName };
                if (activeTab === 'subjects') {
                    updateData.code = newCode;
                }

                // Determine table name
                let table = 'faculties';
                if (activeTab === 'batches') table = 'batches';
                if (activeTab === 'sections') table = 'sections';
                if (activeTab === 'subjects') table = 'subjects';

                await api.updateResource(table, editId, updateData);
                toast({ title: 'Success', description: 'Item updated successfully' });
            } else {
                // Handle Create (Existing Logic)
                if (activeTab === 'departments') {
                    if (isBulkMode) {
                        // Bulk add departments from textarea
                        const deptNames = bulkDepartments.split('\n')
                            .map(name => name.trim())
                            .filter(name => name);

                        // Deduplicate input and check against existing
                        const uniqueNames = Array.from(new Set(deptNames));
                        const existingNames = new Set(departments.map(d => d.name.toLowerCase()));
                        const toAdd = uniqueNames.filter(name => !existingNames.has(name.toLowerCase()));

                        if (toAdd.length === 0) {
                            toast({ title: 'Info', description: 'No new departments to add (all duplicates)' });
                        } else {
                            const promises = toAdd.map(name => api.createFaculty(name));
                            await Promise.all(promises);
                            toast({ title: 'Success', description: `Added ${toAdd.length} departments` });
                        }
                    } else {
                        if (!newItemName) throw new Error('Department name is required');
                        if (departments.some(d => d.name.toLowerCase() === newItemName.trim().toLowerCase())) {
                            throw new Error('Department already exists');
                        }
                        await api.createFaculty(newItemName);
                        toast({ title: 'Success', description: 'Department added' });
                    }
                } else if (activeTab === 'batches') {
                    if (!selectedParentId) throw new Error('Department is required');

                    if (isBulkMode) {
                        // Bulk add batches from range
                        const start = parseInt(initialBatch);
                        const end = parseInt(finalBatch);
                        if (isNaN(start) || isNaN(end) || start > end) throw new Error('Invalid batch range');

                        const existingBatchesStr = new Set(
                            batches.filter(b => b.faculty_id === selectedParentId) // Only check in this dept? Or globally? Batch names are usually unique per dept?
                                .map(b => b.name)
                        );
                        // Actually batch name duplication per dept is what matters

                        const promises = [];
                        let addedCount = 0;
                        for (let i = start; i <= end; i++) {
                            const batchName = i.toString();
                            if (!existingBatchesStr.has(batchName)) {
                                promises.push(api.createBatch(selectedParentId, batchName));
                                addedCount++;
                            }
                        }

                        if (addedCount === 0) {
                            toast({ title: 'Info', description: 'No new batches to add (duplicates)' });
                        } else {
                            await Promise.all(promises);
                            toast({ title: 'Success', description: `Added ${addedCount} batches` });
                        }
                    } else {
                        if (!newItemName) throw new Error('Batch name is required');
                        // Check duplicate in this department
                        const exists = batches.some(b => b.faculty_id === selectedParentId && b.name === newItemName.trim());
                        if (exists) throw new Error('Batch already exists in this department');

                        await api.createBatch(selectedParentId, newItemName);
                        toast({ title: 'Success', description: 'Batch added' });
                    }
                } else if (activeTab === 'sections') {
                    if (!selectedParentId) throw new Error('Batch is required');

                    if (isBulkMode) {
                        // Bulk add sections from letter range
                        const start = initialSection.toUpperCase().charCodeAt(0);
                        const end = finalSection.toUpperCase().charCodeAt(0);
                        if (isNaN(start) || isNaN(end) || start > end) throw new Error('Invalid section range');

                        const promises = [];
                        for (let i = start; i <= end; i++) {
                            promises.push(api.createSection(selectedParentId, String.fromCharCode(i)));
                        }
                        await Promise.all(promises);
                        toast({ title: 'Success', description: `Added sections ${initialSection.toUpperCase()} to ${finalSection.toUpperCase()}` });
                    } else {
                        if (!newItemName) throw new Error('Section name is required');
                        await api.createSection(selectedParentId, newItemName);
                        toast({ title: 'Success', description: 'Section added' });
                    }
                } else if (activeTab === 'subjects') {
                    // Subject creation: Select batch, create for all sections in that batch
                    if (!selectedParentId) throw new Error('Batch is required');

                    // Get all sections for this batch
                    const batchSections = sections.filter(s => s.batch_id === selectedParentId);
                    if (batchSections.length === 0) throw new Error('No sections found in this batch');

                    if (isBulkMode) {
                        const lines = bulkSubjects.split('\n').filter(l => l.trim());
                        if (lines.length === 0) throw new Error('Please enter at least one subject');

                        const uniqueSubjects = [];
                        const seenCodes = new Set();

                        // Parse Lines
                        for (const line of lines) {
                            let name = line.trim();
                            let code = '';

                            // Try to extract code if format is "Code - Name" or "Code: Name"
                            const separatorMatch = line.match(/^([A-Za-z0-9\-\s]+?)\s*[-:]\s*(.+)$/);
                            if (separatorMatch) {
                                code = separatorMatch[1].trim();
                                name = separatorMatch[2].trim();
                            } else {
                                // No separator, treat whole line as name. Generate Code.
                                // Generate code from initials e.g. "Software Engineering" -> "SE"
                                code = name.split(/\s+/).map(w => w[0]).join('').toUpperCase();
                                if (code.length < 2) code = name.substring(0, 3).toUpperCase();
                            }

                            // Basic dedupe in this batch push
                            if (!seenCodes.has(code)) {
                                uniqueSubjects.push({ name, code });
                                seenCodes.add(code);
                            }
                        }

                        // Filter existing subjects in this batch (check any section, assuming uniformity)
                        // If a subject code exists in ANY section of this batch, skip it for simplicity
                        const existingInBatch = new Set(
                            subjects.filter(sub => {
                                const sec = sections.find(s => s.id === sub.section_id);
                                return sec?.batch_id === selectedParentId;
                            }).map(s => s.code.toLowerCase())
                        );

                        const toAdd = uniqueSubjects.filter(s => !existingInBatch.has(s.code.toLowerCase()));

                        if (toAdd.length === 0) {
                            toast({ title: 'Info', description: 'No new subjects to add (duplicates)' });
                        } else {
                            const promises = [];
                            for (const subject of toAdd) {
                                for (const section of batchSections) {
                                    promises.push(api.createSubject(section.id, subject.name, subject.code));
                                }
                            }
                            await Promise.all(promises);
                            toast({ title: 'Success', description: `Added ${toAdd.length} subjects to ${batchSections.length} sections` });
                        }

                    } else {
                        if (!newCode) throw new Error('Subject code is required');
                        if (!newItemName) throw new Error('Subject name is required');

                        // Check duplicate in this batch
                        // If subject code exists in any section of this batch?
                        const exists = subjects.some(sub => {
                            const sec = sections.find(s => s.id === sub.section_id);
                            return sec?.batch_id === selectedParentId && sub.code.toLowerCase() === newCode.toLowerCase();
                        });

                        if (exists) throw new Error('Subject code already exists in this batch');

                        // Create subject for each section
                        const promises = batchSections.map(section =>
                            api.createSubject(section.id, newItemName, newCode)
                        );
                        await Promise.all(promises);
                        toast({ title: 'Success', description: `Subject added to ${batchSections.length} section(s)` });
                    }
                }
            }

            fetchData();
            setIsDialogOpen(false);
            resetForm();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Failed to save item', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setNewItemName('');
        setNewCode('');
        setSelectedParentId('');
        setDialogDeptId('');
        setBulkDepartments('');
        setBulkSubjects('');
        setInitialBatch('');
        setFinalBatch('');
        setInitialSection('');
        setFinalSection('');
        setIsBulkMode(false);
        setIsEditMode(false);
        setEditId('');
    };

    const handleDelete = async (table: string, id: string) => {
        if (!confirm('Are you sure? This action cannot be undone.')) return;
        try {
            await api.deleteResource(table, id);
            toast({ title: 'Deleted', description: 'Item deleted successfully' });
            fetchData();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Failed to delete item', variant: 'destructive' });
        }
    };

    // Helper to get Department Name
    const getDeptName = (id: string) => departments.find(d => d.id === id)?.name || 'Unknown';
    const getBatchName = (id: string) => batches.find(b => b.id === id)?.name || 'Unknown';
    const getSectionName = (id: string) => sections.find(s => s.id === id)?.name || 'Unknown';

    return (
        <div className="space-y-4 sm:space-y-6 pb-6">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Academic Structure</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage departments, batches, sections, and subjects</p>
            </div>

            <Tabs defaultValue="departments" onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                    <TabsTrigger value="departments" className="text-xs sm:text-sm px-2 py-2">Depts</TabsTrigger>
                    <TabsTrigger value="batches" className="text-xs sm:text-sm px-2 py-2">Batches</TabsTrigger>
                    <TabsTrigger value="sections" className="text-xs sm:text-sm px-2 py-2">Sections</TabsTrigger>
                    <TabsTrigger value="subjects" className="text-xs sm:text-sm px-2 py-2">Subjects</TabsTrigger>
                </TabsList>

                {/* Search and Add Header */}
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${activeTab}...`}
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 w-full sm:w-auto"><Plus className="w-4 h-4" /> Add New</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4">
                            <DialogHeader>
                                <DialogTitle className="capitalize">Add New {activeTab.slice(0, -1)}</DialogTitle>
                                {(activeTab === 'departments' || activeTab === 'batches' || activeTab === 'sections' || activeTab === 'subjects') && (
                                    <div className="flex items-center gap-2 pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isBulkMode}
                                                onChange={(e) => setIsBulkMode(e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-muted-foreground">Bulk Add Mode</span>
                                        </label>
                                    </div>
                                )}
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* DEPARTMENTS - Single or Bulk */}
                                {activeTab === 'departments' && (
                                    isBulkMode ? (
                                        <div className="grid gap-2">
                                            <Label>Department Names (one per line)</Label>
                                            <textarea
                                                value={bulkDepartments}
                                                onChange={(e) => setBulkDepartments(e.target.value)}
                                                placeholder="EEE&#10;ICE&#10;SWE&#10;CSE"
                                                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            />
                                            <p className="text-xs text-muted-foreground">Enter one department per line</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-2">
                                            <Label>Department Name</Label>
                                            <Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="e.g. EEE" />
                                        </div>
                                    )
                                )}

                                {activeTab === 'subjects' && (
                                    isBulkMode ? (
                                        <div className="grid gap-2">
                                            <Label>Subjects (one per line)</Label>
                                            <textarea
                                                value={bulkSubjects}
                                                onChange={(e) => setBulkSubjects(e.target.value)}
                                                placeholder="CSE-101 - Computer Fundamentals&#10;Physics&#10;MAT-101 : Mathematics"
                                                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            />
                                            <p className="text-xs text-muted-foreground">Format: 'Code - Name' or just 'Name' (Code will be generated)</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid gap-2">
                                                <Label>Subject Code</Label>
                                                <Input value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="e.g. CSE-101" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Subject Name</Label>
                                                <Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Enter name" />
                                            </div>
                                        </>
                                    )
                                )}

                                {activeTab !== 'departments' && activeTab !== 'batches' && activeTab !== 'sections' && (
                                    <div className="grid gap-2">
                                        <Label>Name</Label>
                                        <Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Enter name" />
                                    </div>
                                )}

                                {/* Batches -> Select Dept + Range or Single */}
                                {activeTab === 'batches' && (
                                    <>
                                        {!isEditMode && (
                                            <div className="grid gap-2">
                                                <Label>Department</Label>
                                                <Select onValueChange={setSelectedParentId} value={selectedParentId}>
                                                    <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                                    <SelectContent>
                                                        {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        {isBulkMode ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="grid gap-2">
                                                    <Label>Initial Batch</Label>
                                                    <Input
                                                        type="number"
                                                        value={initialBatch}
                                                        onChange={(e) => setInitialBatch(e.target.value)}
                                                        placeholder="44"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Final Batch</Label>
                                                    <Input
                                                        type="number"
                                                        value={finalBatch}
                                                        onChange={(e) => setFinalBatch(e.target.value)}
                                                        placeholder="47"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid gap-2">
                                                <Label>Batch Name</Label>
                                                <Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="e.g. 44" />
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Sections -> Select Dept -> Select Batch + Range or Single */}
                                {activeTab === 'sections' && (
                                    <>
                                        {!isEditMode && (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label>Department</Label>
                                                    <Select onValueChange={(val) => { setDialogDeptId(val); setSelectedParentId(''); }}>
                                                        <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                                        <SelectContent>
                                                            {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Batch</Label>
                                                    <Select onValueChange={setSelectedParentId} disabled={!dialogDeptId}>
                                                        <SelectTrigger><SelectValue placeholder="Select Batch" /></SelectTrigger>
                                                        <SelectContent>
                                                            {batches.filter(b => b.faculty_id === dialogDeptId).map(b => (
                                                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </>
                                        )}
                                        {isBulkMode ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="grid gap-2">
                                                    <Label>Initial Section</Label>
                                                    <Input
                                                        maxLength={1}
                                                        value={initialSection}
                                                        onChange={(e) => setInitialSection(e.target.value.toUpperCase())}
                                                        placeholder="A"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Final Section</Label>
                                                    <Input
                                                        maxLength={1}
                                                        value={finalSection}
                                                        onChange={(e) => setFinalSection(e.target.value.toUpperCase())}
                                                        placeholder="P"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid gap-2">
                                                <Label>Section Name</Label>
                                                <Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="e.g. A" />
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Subjects -> Select Dept -> Select Batch (creates for all sections) */}
                                {activeTab === 'subjects' && (
                                    <>
                                        {!isEditMode && (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label>Department</Label>
                                                    <Select onValueChange={(val) => { setDialogDeptId(val); setSelectedParentId(''); }}>
                                                        <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                                        <SelectContent>
                                                            {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Batch</Label>
                                                    <Select onValueChange={setSelectedParentId} disabled={!dialogDeptId}>
                                                        <SelectTrigger><SelectValue placeholder="Select Batch" /></SelectTrigger>
                                                        <SelectContent>
                                                            {batches.filter(b => b.faculty_id === dialogDeptId).map(b => (
                                                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <p className="text-xs text-muted-foreground">Subject will be added to all sections in this batch</p>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAdd} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* DEPARTMENTS */}
                <TabsContent value="departments">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departments
                                    .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map((dept) => (
                                        <TableRow key={dept.id}>
                                            <TableCell className="font-medium">{dept.name}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit('departments', dept)}>
                                                    <Pencil className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete('faculties', dept.id)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* BATCHES */}
                <TabsContent value="batches" className="space-y-4">
                    {/* Filter */}
                    <div className="flex gap-3 items-center">
                        <Label className="text-sm">Filter by Department:</Label>
                        <Select value={filterDept} onValueChange={setFilterDept}>
                            <SelectTrigger className="w-64">
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {batches
                                    .filter(b => filterDept === 'all' || b.faculty_id === filterDept)
                                    .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map((batch) => (
                                        <TableRow key={batch.id}>
                                            <TableCell className="font-medium">{batch.name}</TableCell>
                                            <TableCell>{getDeptName(batch.faculty_id)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit('batches', batch)}>
                                                    <Pencil className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete('batches', batch.id)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* SECTIONS */}
                <TabsContent value="sections" className="space-y-4">
                    {/* Filters */}
                    <div className="flex gap-3 items-center flex-wrap">
                        <Label className="text-sm">Filter by Department:</Label>
                        <Select value={filterDept} onValueChange={(val) => { setFilterDept(val); setFilterBatch('all'); }}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Label className="text-sm">Filter by Batch:</Label>
                        <Select value={filterBatch} onValueChange={setFilterBatch} disabled={filterDept === 'all'}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Batches</SelectItem>
                                {batches.filter(b => filterDept === 'all' || b.faculty_id === filterDept).map(b => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Batch</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sections.filter(s => {
                                    const batch = batches.find(b => b.id === s.batch_id);
                                    if (filterDept !== 'all' && batch?.faculty_id !== filterDept) return false;
                                    if (filterBatch !== 'all' && s.batch_id !== filterBatch) return false;
                                    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                                    return true;
                                }).map((section) => {
                                    const batch = batches.find(b => b.id === section.batch_id);
                                    return (
                                        <TableRow key={section.id}>
                                            <TableCell className="font-medium">{section.name}</TableCell>
                                            <TableCell>{batch ? `${batch.name} (${getDeptName(batch.faculty_id)})` : 'Unknown'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete('sections', section.id)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* SUBJECTS */}
                <TabsContent value="subjects" className="space-y-4">
                    {/* Filters */}
                    <div className="flex gap-3 items-center flex-wrap">
                        <Label className="text-sm">Filter by Department:</Label>
                        <Select value={filterDept} onValueChange={(val) => { setFilterDept(val); setFilterBatch('all'); }}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Label className="text-sm">Filter by Batch:</Label>
                        <Select value={filterBatch} onValueChange={setFilterBatch} disabled={filterDept === 'all'}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Batches</SelectItem>
                                {batches.filter(b => filterDept === 'all' || b.faculty_id === filterDept).map(b => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Batch (Dept)</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subjects.filter(sub => {
                                    const section = sections.find(s => s.id === sub.section_id);
                                    const batch = section ? batches.find(b => b.id === section.batch_id) : null;
                                    if (filterDept !== 'all' && batch?.faculty_id !== filterDept) return false;
                                    if (filterBatch !== 'all' && section?.batch_id !== filterBatch) return false;

                                    if (searchQuery) {
                                        const q = searchQuery.toLowerCase();
                                        return sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q);
                                    }
                                    return true;
                                }).map((subject) => {
                                    const section = sections.find(s => s.id === subject.section_id);
                                    const batch = section ? batches.find(b => b.id === section.batch_id) : null;
                                    const dept = batch ? departments.find(d => d.id === batch.faculty_id) : null;

                                    return (
                                        <TableRow key={subject.id}>
                                            <TableCell className="font-mono">{subject.code}</TableCell>
                                            <TableCell className="font-medium">{subject.name}</TableCell>
                                            <TableCell>
                                                {batch ? `${batch.name} (${dept?.name})` : 'Unknown'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete('subjects', subject.id)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AcademicStructure;
