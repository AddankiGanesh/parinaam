'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search, Filter, CheckCircle, XCircle, Eye,
  Users, Shield, Building2, Download, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';

interface User {
  id: string; email: string; full_name: string; phone: string;
  role: string; college_name: string; is_amrita_student: boolean;
  roll_number: string; department: string; year_of_study: string;
  id_card_url: string; verification_status: string; platform_fee_paid: boolean;
  confirmed_registrations: string; created_at: string; club_name: string;
}

const ROLES = ['', 'student', 'club_admin', 'super_admin'];
const VER_STATUS = ['', 'pending', 'verified', 'rejected'];

export default function AdminUsersPage() {
  const { user: me } = useRequireRole('super_admin');
  const [users, setUsers]       = useState<User[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter]   = useState('');
  const [verFilter, setVerFilter]     = useState('');
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState<User | null>(null);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '40' });
    if (search)     params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    if (verFilter)  params.set('verification_status', verFilter);
    const res  = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    if (data.success) { setUsers(data.data.users); setTotal(data.data.pagination.total); }
    setLoading(false);
  }, [search, roleFilter, verFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleVerify = async (userId: string, status: 'verified' | 'rejected') => {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchUsers();
    setSelected(null);
  };

  const handleRoleChange = async (userId: string, role: string, clubId?: string) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, club_id: clubId }),
    });
    fetchUsers();
  };

  const exportCSV = () => {
    const headers = ['Name','Email','Phone','Role','College','Amrita','Roll No','Dept','Year','Verification','Platform Fee','Registrations','Joined'];
    const rows = users.map(u => [
      u.full_name, u.email, u.phone||'', u.role,
      u.college_name||'', u.is_amrita_student?'Yes':'No',
      u.roll_number||'', u.department||'', u.year_of_study||'',
      u.verification_status, u.platform_fee_paid?'Paid':'Unpaid',
      u.confirmed_registrations,
      new Date(u.created_at).toLocaleDateString(),
    ]);
    const csv = [headers,...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download = 'parinaam-users.csv'; a.click();
  };

  if (!me) return null;

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-1">
              <ChevronLeft size={14}/> Admin
            </Link>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-slate-500 text-sm">{total} total users</p>
          </div>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-300 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10">
            <Download size={14}/> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
            <input value={searchInput} onChange={e=>setSearchInput(e.target.value)}
              placeholder="Search name, email, college…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"/>
          </div>
          <select value={roleFilter} onChange={e=>{setRoleFilter(e.target.value);setPage(1);}}
            className="bg-[#0e0b1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
            {ROLES.map(r=><option key={r || 'all-roles'} value={r}>{r||'All Roles'}</option>)}
          </select>
          <select value={verFilter} onChange={e=>{setVerFilter(e.target.value);setPage(1);}}
            className="bg-[#0e0b1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
            {VER_STATUS.map(s=><option key={s || 'all-ver'} value={s}>{s||'All Verification'}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  {['User','College','Role','Verification','Fee','Events','Actions'].map(h=>(
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({length:8}).map((_,i)=>(
                    <tr key={`skel-${i}`}><td colSpan={7} className="px-4 py-4">
                      <div className="h-4 bg-white/5 rounded animate-pulse"/>
                    </td></tr>
                  ))
                ) : users.length === 0 ? (
                  <tr key="no-data"><td colSpan={7} className="text-center py-12 text-slate-500">No users found</td></tr>
                ) : users.map((u, i)=>(
                  <tr key={u.id ? `user-row-${u.id}` : `user-row-${u.email}-${i}`} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {((u.full_name || u.email || 'U').charAt(0)).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{u.full_name || u.email || 'Anonymous'}</p>
                          <p className="text-slate-500 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-300 text-xs">{u.college_name||'—'}</p>
                      {u.is_amrita_student && <span className="text-xs text-purple-400">Amrita</span>}
                      {u.roll_number && <p className="text-slate-600 text-xs font-mono">{u.roll_number}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} clubName={u.club_name}/>
                    </td>
                    <td className="px-4 py-3">
                      <VerBadge status={u.verification_status}/>
                    </td>
                    <td className="px-4 py-3">
                      {u.platform_fee_paid
                        ? <span className="text-green-400 text-xs">✓ Paid</span>
                        : <span className="text-slate-600 text-xs">Unpaid</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm font-semibold text-center">{u.confirmed_registrations}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {u.verification_status === 'pending' && u.id_card_url && (
                          <>
                            <button onClick={()=>handleVerify(u.id,'verified')}
                              className="p-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all" title="Approve">
                              <CheckCircle size={13}/>
                            </button>
                            <button onClick={()=>handleVerify(u.id,'rejected')}
                              className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all" title="Reject">
                              <XCircle size={13}/>
                            </button>
                          </>
                        )}
                        {u.id_card_url && (
                          <a href={u.id_card_url} target="_blank" rel="noreferrer"
                            className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all" title="View ID">
                            <Eye size={13}/>
                          </a>
                        )}
                        <button onClick={()=>setSelected(u)}
                          className="p-1.5 bg-white/5 text-slate-400 hover:bg-white/10 rounded-lg transition-all" title="Manage role">
                          <Shield size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {total > 40 && (
          <div className="flex justify-center items-center gap-3 mt-5">
            <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
              className="p-2 bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-30 hover:bg-white/10">
              <ChevronLeft size={16}/>
            </button>
            <span className="text-slate-400 text-sm">Page {page} of {Math.ceil(total/40)}</span>
            <button disabled={page>=Math.ceil(total/40)} onClick={()=>setPage(p=>p+1)}
              className="p-2 bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-30 hover:bg-white/10">
              <ChevronRight size={16}/>
            </button>
          </div>
        )}
      </div>

      {/* Role change modal */}
      {selected && (
        <RoleModal user={selected} onClose={()=>setSelected(null)} onSave={handleRoleChange}/>
      )}
    </div>
  );
}

function RoleBadge({role,clubName}:{role?:string;clubName?:string}) {
  const safeRole = role || 'student';
  const map:Record<string,string> = {
    super_admin:'bg-red-500/20 text-red-300',
    club_admin:'bg-blue-500/20 text-blue-300',
    student:'bg-purple-500/20 text-purple-300',
  };
  return (
    <div>
      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${map[safeRole]||'bg-white/10 text-slate-400'}`}>
        {safeRole.replace(/_/g,' ')}
      </span>
      {clubName && <p className="text-slate-500 text-xs mt-0.5">{clubName}</p>}
    </div>
  );
}

function VerBadge({status}:{status?:string}) {
  const safeStatus = status || 'pending';
  const map:Record<string,string> = {
    verified:'bg-green-500/20 text-green-300',
    pending:'bg-amber-500/20 text-amber-300',
    rejected:'bg-red-500/20 text-red-300',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${map[safeStatus]||'bg-white/10 text-slate-400'}`}>{safeStatus}</span>;
}

function RoleModal({user,onClose,onSave}:{user:User;onClose:()=>void;onSave:(id:string,role:string,clubId?:string)=>void}) {
  const [role,setRole]=useState(user.role || 'student');
  const [clubs,setClubs]=useState<{id:string;name:string}[]>([]);
  const [clubId,setClubId]=useState('');

  useEffect(()=>{
    fetch('/api/clubs').then(r=>r.json()).then(d=>{if(d.success)setClubs(d.data.clubs);});
  },[]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}}
        className="bg-[#0e0b1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm"
        onClick={e=>e.stopPropagation()}>
        <h3 className="text-white font-bold text-lg mb-1">Change Role</h3>
        <p className="text-slate-500 text-sm mb-4">{user.full_name}</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
              <option value="student">Student</option>
              <option value="club_admin">Club Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          {role==='club_admin' && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Assign Club</label>
              <select value={clubId} onChange={e=>setClubId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
                <option value="">Select club</option>
                {clubs.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm">Cancel</button>
          <button onClick={()=>{onSave(user.id,role,clubId||undefined);onClose();}}
            className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl text-sm">
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}
