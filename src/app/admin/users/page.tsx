'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, CheckCircle, XCircle, Eye,
  Users, Shield, Building2, Download, ChevronLeft, ChevronRight,
  GraduationCap, Calendar, Phone, Mail, IdCard, AlertTriangle,
  RotateCcw, Sparkles, Check, X, ShieldAlert, CreditCard
} from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  college_name: string;
  is_amrita_student: boolean;
  roll_number: string;
  department: string;
  year_of_study: string;
  city: string;
  id_card_url: string;
  verification_status: string;
  verification_note: string;
  platform_fee_paid: boolean;
  pass_type: string;
  qr_token: string;
  email_verified: boolean;
  confirmed_registrations: string;
  created_at: string;
  club_name: string;
}

interface UserStats {
  total: number;
  amrita_count: number;
  external_count: number;
  pending_count: number;
  verified_count: number;
}

const BRANCHES = ['CSE', 'CSE-AIE', 'AIDS', 'CCE', 'ECE', 'QUANTUM'];
const YEARS = ['1', '2', '3', '4'];
const ROLES = [
  { value: '', label: 'All Roles' },
  { value: 'student', label: 'Students' },
  { value: 'club_admin', label: 'Club Admins' },
  { value: 'super_admin', label: 'Super Admins' },
];
const STUDENT_TYPES = [
  { value: '', label: 'All Institutions' },
  { value: 'amrita', label: 'Amrita Amaravati' },
  { value: 'other', label: 'External Colleges' },
];
const VER_STATUS = [
  { value: '', label: 'All KYC Status' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'rejected', label: 'Rejected' },
];
const FEE_STATUS = [
  { value: '', label: 'All Pass Status' },
  { value: 'true', label: 'Active Pass (Paid/Free)' },
  { value: 'false', label: 'Unpaid / Inactive' },
];

export default function AdminUsersPage() {
  const { user: me } = useRequireRole('super_admin');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    amrita_count: 0,
    external_count: 0,
    pending_count: 0,
    verified_count: 0,
  });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [verFilter, setVerFilter] = useState('');
  const [feeFilter, setFeeFilter] = useState('');
  const [page, setPage] = useState(1);

  // Selected User Modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '30' });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    if (typeFilter) params.set('student_type', typeFilter);
    if (deptFilter) params.set('department', deptFilter);
    if (yearFilter) params.set('year_of_study', yearFilter);
    if (verFilter) params.set('verification_status', verFilter);
    if (feeFilter) params.set('platform_fee_paid', feeFilter);

    try {
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users);
        setTotal(data.data.pagination.total);
        setTotalPages(data.data.pagination.totalPages || 1);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, typeFilter, deptFilter, yearFilter, verFilter, feeFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const resetFilters = () => {
    setSearchInput('');
    setSearch('');
    setRoleFilter('');
    setTypeFilter('');
    setDeptFilter('');
    setYearFilter('');
    setVerFilter('');
    setFeeFilter('');
    setPage(1);
  };

  const handleVerify = async (userId: string, status: 'verified' | 'rejected', note?: string) => {
    setActionLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    setActionLoading(false);
    fetchUsers();
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, verification_status: status, verification_note: note || '' } : null);
    }
  };

  const handleRoleChange = async (userId: string, role: string, clubId?: string) => {
    setActionLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, club_id: clubId }),
    });
    setActionLoading(false);
    fetchUsers();
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, role } : null);
    }
  };

  const exportCSV = () => {
    const headers = [
      'Name', 'Email', 'Phone', 'Role', 'Institution', 'Amrita Student',
      'Roll Number', 'Branch / Department', 'Year of Study', 'City',
      'KYC Verification', 'Pass Status', 'Enrolled Events', 'Registered At'
    ];
    const rows = users.map(u => [
      u.full_name || '',
      u.email || '',
      u.phone || '',
      u.role || '',
      u.college_name || (u.is_amrita_student ? 'Amrita Vishwa Vidyapeetham' : ''),
      u.is_amrita_student ? 'Yes' : 'No',
      u.roll_number || '',
      u.department || '',
      u.year_of_study ? `Year ${u.year_of_study}` : '',
      u.city || '',
      u.verification_status || '',
      u.platform_fee_paid ? 'Active Pass' : 'Unpaid',
      u.confirmed_registrations || '0',
      new Date(u.created_at).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows]
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `parinaam-users-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!me) return null;

  const hasActiveFilters = Boolean(
    search || roleFilter || typeFilter || deptFilter || yearFilter || verFilter || feeFilter
  );

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <Link
              href="/superadmin"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 mb-1.5 transition-colors"
            >
              <ChevronLeft size={14} /> Back to Command HQ
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              User Database & Participant Records
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Filter by Branch, Year, Institution, KYC Status & Manage Access
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Download size={14} /> Export CSV ({total})
            </button>
          </div>
        </div>

        {/* Top KPI Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400 text-xs font-medium">Total Registered</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
            <p className="text-purple-300 text-xs font-medium">Amrita Students</p>
            <p className="text-2xl font-bold text-purple-200 mt-1">{stats.amrita_count}</p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
            <p className="text-cyan-300 text-xs font-medium">External Students</p>
            <p className="text-2xl font-bold text-cyan-200 mt-1">{stats.external_count}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <p className="text-amber-300 text-xs font-medium">Pending ID Review</p>
            <p className="text-2xl font-bold text-amber-200 mt-1">{stats.pending_count}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <p className="text-emerald-300 text-xs font-medium">Verified Accounts</p>
            <p className="text-2xl font-bold text-emerald-200 mt-1">{stats.verified_count}</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search name, email, roll number, phone..."
                className="w-full bg-[#0e0b1a] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2 flex-wrap">
              {/* Institution */}
              <select
                value={typeFilter}
                onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
                className="bg-[#0e0b1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {STUDENT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              {/* Branch */}
              <select
                value={deptFilter}
                onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
                className="bg-[#0e0b1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">All Branches</option>
                {BRANCHES.map(b => (
                  <option key={b} value={b}>Branch: {b}</option>
                ))}
              </select>

              {/* Year */}
              <select
                value={yearFilter}
                onChange={e => { setYearFilter(e.target.value); setPage(1); }}
                className="bg-[#0e0b1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">All Years</option>
                {YEARS.map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>

              {/* KYC */}
              <select
                value={verFilter}
                onChange={e => { setVerFilter(e.target.value); setPage(1); }}
                className="bg-[#0e0b1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {VER_STATUS.map(v => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>

              {/* Role */}
              <select
                value={roleFilter}
                onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
                className="bg-[#0e0b1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>

              {/* Pass Status */}
              <select
                value={feeFilter}
                onChange={e => { setFeeFilter(e.target.value); setPage(1); }}
                className="bg-[#0e0b1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {FEE_STATUS.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>

              {/* Reset */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl transition-colors"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
            <span>Showing {users.length} of {total} records</span>
            {hasActiveFilters && (
              <span className="text-purple-300 font-medium">Filtered active view</span>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3.5">Student / User</th>
                  <th className="px-4 py-3.5">Campus & Roll No</th>
                  <th className="px-4 py-3.5">Academic</th>
                  <th className="px-4 py-3.5">KYC Verification</th>
                  <th className="px-4 py-3.5">Pass Status</th>
                  <th className="px-4 py-3.5 text-center">Events</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skel-${i}`}>
                      <td colSpan={7} className="px-4 py-4">
                        <div className="h-5 bg-white/5 rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400">
                      <Users size={32} className="mx-auto text-slate-600 mb-2" />
                      <p className="font-semibold text-slate-300">No users found</p>
                      <p className="text-xs text-slate-500 mt-1">Try resetting the filters or modifying your search query.</p>
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.03] transition-colors group">
                      {/* Name & Email */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {((u.full_name || u.email).charAt(0)).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{u.full_name || 'Anonymous Student'}</p>
                            <p className="text-slate-400 text-[11px] truncate">{u.email}</p>
                            {u.phone && <p className="text-slate-500 text-[10px] font-mono">{u.phone}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Campus & Roll No */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5">
                          {u.is_amrita_student ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-md">
                              Amrita Amaravati
                            </span>
                          ) : (
                            <p className="text-slate-300 font-medium text-xs truncate max-w-[160px]">
                              {u.college_name || 'External College'}
                            </p>
                          )}
                          {u.roll_number && (
                            <p className="font-mono text-[11px] text-slate-400">{u.roll_number}</p>
                          )}
                        </div>
                      </td>

                      {/* Academic (Branch & Year) */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {u.department ? (
                            <span className="text-[11px] font-medium bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-200">
                              {u.department}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-600">—</span>
                          )}
                          {u.year_of_study && (
                            <span className="text-[11px] font-medium bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-300">
                              Yr {u.year_of_study}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* KYC Status */}
                      <td className="px-4 py-3.5">
                        {u.verification_status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle size={12} /> Verified
                          </span>
                        ) : u.verification_status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                            <XCircle size={12} /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            <AlertTriangle size={12} /> Pending ID
                          </span>
                        )}
                      </td>

                      {/* Pass Status */}
                      <td className="px-4 py-3.5">
                        {u.is_amrita_student ? (
                          <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
                            Free Amrita Pass
                          </span>
                        ) : u.platform_fee_paid ? (
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            Active Pass
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">Unpaid</span>
                        )}
                      </td>

                      {/* Events Enrolled */}
                      <td className="px-4 py-3.5 text-center font-semibold text-white">
                        {u.confirmed_registrations || '0'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 text-slate-300 hover:text-purple-200 border border-white/10 transition-colors"
                            title="View Full Profile"
                          >
                            <Eye size={14} />
                          </button>

                          {u.verification_status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVerify(u.id, 'verified')}
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                                title="Approve KYC"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => handleVerify(u.id, 'rejected')}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                                title="Reject KYC"
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="flex items-center gap-1 text-xs font-semibold text-slate-300 disabled:text-slate-600 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:bg-transparent border border-white/10 transition-colors"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span className="text-xs text-slate-400">
                Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 text-xs font-semibold text-slate-300 disabled:text-slate-600 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:bg-transparent border border-white/10 transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        <AnimatePresence>
          {selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl bg-[#0e071c] border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl relative"
              >
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                      {((selectedUser.full_name || selectedUser.email).charAt(0)).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{selectedUser.full_name || selectedUser.email}</h3>
                      <p className="text-xs text-slate-400">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-4 rounded-xl border border-white/5">
                    <div>
                      <p className="text-slate-500">Institution</p>
                      <p className="font-semibold text-slate-200 mt-0.5">
                        {selectedUser.is_amrita_student ? 'Amrita Vishwa Vidyapeetham, Amaravati' : (selectedUser.college_name || 'External')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Roll Number</p>
                      <p className="font-mono font-semibold text-purple-300 mt-0.5">
                        {selectedUser.roll_number || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Branch</p>
                      <p className="font-semibold text-slate-200 mt-0.5">
                        {selectedUser.department || 'Not Specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Year of Study</p>
                      <p className="font-semibold text-slate-200 mt-0.5">
                        {selectedUser.year_of_study ? `Year ${selectedUser.year_of_study}` : 'Not Specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Phone</p>
                      <p className="font-mono text-slate-200 mt-0.5">{selectedUser.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">City</p>
                      <p className="text-slate-200 mt-0.5">{selectedUser.city || 'N/A'}</p>
                    </div>
                  </div>

                  {/* ID Card Viewer if available */}
                  {selectedUser.id_card_url && (
                    <div className="border border-white/10 rounded-xl p-3 bg-white/5">
                      <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                        <IdCard size={14} className="text-purple-400" /> Uploaded College ID Card
                      </p>
                      <img
                        src={selectedUser.id_card_url}
                        alt="College ID"
                        className="w-full max-h-52 object-contain rounded-lg bg-black/50"
                      />
                    </div>
                  )}

                  {/* KYC Approval Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      disabled={actionLoading}
                      onClick={() => handleVerify(selectedUser.id, 'verified')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={14} /> Approve & Verify Account
                    </button>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleVerify(selectedUser.id, 'rejected')}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={14} /> Reject ID Card
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
