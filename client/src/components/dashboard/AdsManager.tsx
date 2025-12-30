import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, useTheme
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

interface AdCampaign {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'ended';
    budget: number;
    spent: number;
    impressions: number;
    clicks: number;
    startDate: string;
    endDate: string;
}

const AdsManager: React.FC = () => {
    const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCampaign, setCurrentCampaign] = useState<AdCampaign | null>(null);
    const [formData, setFormData] = useState({ name: '', budget: 0, startDate: '', endDate: '' });

    useEffect(() => {
        // Mock data for display
        setCampaigns([
            { id: '1', name: 'Summer Sale', status: 'active', budget: 1000, spent: 450, impressions: 10000, clicks: 300, startDate: '2023-06-01', endDate: '2023-08-31' },
            { id: '2', name: 'New Arrivals', status: 'paused', budget: 500, spent: 200, impressions: 5000, clicks: 150, startDate: '2023-09-01', endDate: '2023-09-30' }
        ]);
    }, []);

    const handleOpenDialog = (campaign?: AdCampaign) => {
        if (campaign) {
            setCurrentCampaign(campaign);
            setFormData({ name: campaign.name, budget: campaign.budget, startDate: campaign.startDate, endDate: campaign.endDate });
        } else {
            setCurrentCampaign(null);
            setFormData({ name: '', budget: 0, startDate: '', endDate: '' });
        }
        setOpenDialog(true);
    };

    const handleSave = () => {
        // Logic to save campaign
        setOpenDialog(false);
    };

    return (
        <Box sx={{ p: 4, pt: "80px" }}> {/* Added padding top for navbar */}
            <Typography variant="h4" gutterBottom>Ads Manager 10X</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ mb: 3 }}>
                Create Campaign
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Budget</TableCell>
                            <TableCell>Spent</TableCell>
                            <TableCell>Impressions</TableCell>
                            <TableCell>Clicks</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {campaigns.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell>{c.name}</TableCell>
                                <TableCell>{c.status}</TableCell>
                                <TableCell>${c.budget}</TableCell>
                                <TableCell>${c.spent}</TableCell>
                                <TableCell>{c.impressions}</TableCell>
                                <TableCell>{c.clicks}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(c)}><Edit /></IconButton>
                                    <IconButton><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{currentCampaign ? 'Edit Campaign' : 'New Campaign'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Name" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <TextField margin="dense" label="Budget" type="number" fullWidth value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdsManager;
