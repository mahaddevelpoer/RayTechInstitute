"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileText,
  HelpCircle,
  FileCode,
  Award,
  Newspaper,
  Video,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { clearAdminSession } from "@/utils/security";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { verifyAdminAccess } from "@/lib/supabase";
import { learningAdminRequest } from '@/lib/learning/admin';

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [operationError, setOperationError] = useState('');
  useEffect(() => {
    const show = (event: Event) => setOperationError(String((event as CustomEvent).detail || 'The operation failed. Please retry.').slice(0, 500));
    const clear = () => setOperationError('');
    window.addEventListener('raytech-admin-error', show);
    window.addEventListener('raytech-admin-operation-start', clear);
    return () => { window.removeEventListener('raytech-admin-error', show); window.removeEventListener('raytech-admin-operation-start', clear); };
  }, []);
  const [publishStatus, setPublishStatus] = useState<{
    status: string;
    message: string;
  } | null>(null);
  useEffect(() => {
    const update = (event: Event) =>
      setPublishStatus((event as CustomEvent).detail);
    window.addEventListener("raytech-publish-status", update);
    return () => window.removeEventListener("raytech-publish-status", update);
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin/login/") {
      setIsChecking(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setIsChecking(false);
        router.push("/admin/login");
      } else {
        const access = await verifyAdminAccess();
        if (!access.ok) {
          if (access.reason === 'unauthorized') await signOut(auth).catch(() => undefined);
          clearAdminSession();
          setIsAuthenticated(false);
          setIsChecking(false);
          router.push("/admin/login");
        } else {
          setIsAuthenticated(true);
          setIsChecking(false);
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return <>{children}</>;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-white text-slate-700 flex items-center justify-center text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-navy-600 animate-ping" />
          <span>Verifying administrator privileges...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    clearAdminSession();
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Classes", href: "/admin/classes", icon: GraduationCap },
    { label: "Courses & Lessons", href: "/admin/courses", icon: BookOpen },
    { label: "Health & Release Review", href: "/admin/health", icon: Shield },
    { label: "Subjects", href: "/admin/subjects", icon: BookOpen },
    { label: "Notes Manager", href: "/admin/notes", icon: FileText },
    { label: "MCQs Builder", href: "/admin/mcqs", icon: HelpCircle },
    { label: "Weekly Competition", href: "/admin/competition", icon: Award },
    { label: "Past Papers", href: "/admin/past-papers", icon: FileCode },
    { label: "Gazettes & Results", href: "/admin/gazettes", icon: Award },
    { label: "Blogs & Updates", href: "/admin/blogs", icon: Newspaper },
    { label: "Video Quizzes", href: "/admin/videos", icon: Video },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-12 bg-navy-700 text-white px-4 flex items-center justify-between z-40 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white hover:text-slate-200 p-1"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">RayTech Admin Panel</span>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors text-xs ml-3"
          >
            <span>Visit Live Website</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-200">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs hidden sm:inline">Admin (Verified)</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex min-h-12 items-center gap-1 text-white hover:bg-navy-800 transition-colors text-xs px-2.5 py-1 bg-navy-800/80 rounded"
          >
            <LogOut className="w-3 h-3" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-12 left-0 z-30 w-56 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              Management Menu
            </div>
            <nav className="space-y-1 text-xs">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex min-h-12 items-center gap-2.5 px-3 py-2 rounded transition-colors font-medium ${
                      isActive
                        ? "bg-navy-600 text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-navy-700"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50"
        >
          <div className="max-w-6xl mx-auto">
            {operationError && <div role="alert" className="mb-5 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-900"><p>{operationError}</p><button type="button" className="mt-2 min-h-12 rounded-md border border-red-300 px-3 font-semibold" onClick={() => setOperationError('')}>Dismiss error</button></div>}
            {publishStatus && (
              <div
                role="status"
                className={`mb-5 rounded-lg border p-4 text-sm ${publishStatus.status === "error" ? "border-amber-300 bg-amber-50 text-amber-950" : "border-navy-200 bg-navy-50 text-navy-900"}`}
              >
                <p>{publishStatus.message}</p>
                {publishStatus.status==='error'&&<button className="learn-button mt-3" onClick={async()=>{setPublishStatus({status:'queued',message:'Requesting a fresh website rebuild...'});try{await learningAdminRequest('trigger_static_rebuild');setPublishStatus({status:'queued',message:'Rebuild requested. Your saved content will appear when deployment completes.'});}catch{setPublishStatus({status:'error',message:'Publishing is still unavailable. Your database content remains saved. Retry later.'});}}}>Retry publishing</button>}
                <a
                  href="https://github.com/mahaddevelpoer/RayTechInstitute/actions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-12 items-center font-semibold underline"
                >
                  Check publishing status
                </a>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
