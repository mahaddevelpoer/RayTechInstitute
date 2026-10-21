"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TheWork } from "@/components/TheWork";
import { SubjectMap } from "@/components/SubjectMap";
import { FeaturedLecture } from "@/components/FeaturedLecture";
import { LectureArchive } from "@/components/LectureArchive";
import { LectureModal } from "@/components/LectureModal";
import { Classroom } from "@/components/Classroom";
import { Workbench } from "@/components/Workbench";
import { FollowArchive } from "@/components/FollowArchive";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { useYouTubeSync } from "@/hooks/useYouTubeSync";
import { AdReservation } from '@/components/AdReservation';

export default function HomePage() {
  const { lectures, isLiveConnected, isSyncing } = useYouTubeSync();
  const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>("ALL");

  const selectedLecture = activeLectureId
    ? lectures.find((l) => l.id === activeLectureId) || null
    : null;

  const handleOpenLectureModal = (lectureId: string) => {
    setActiveLectureId(lectureId);
  };

  const handleCloseLectureModal = () => {
    setActiveLectureId(null);
  };

  const handleCategorySelectFromSubjectMap = (category: string) => {
    setSelectedCategoryFilter(category.toUpperCase());
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-800 flex flex-col">
      {/* Top Header */}
      <Header />

      {/* Main Educational Sections */}
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Hero Banner */}
        <Hero />

        {/* Learning Modules */}
        <TheWork />

        {/* Subject Directory */}
        <SubjectMap
          lectures={lectures}
          onSelectCategory={handleCategorySelectFromSubjectMap}
        />

        {/* Featured Video Lecture */}
        <FeaturedLecture
          lectures={lectures}
          onOpenModal={handleOpenLectureModal}
        />

        {/* Video Lectures Search & Filter Grid */}
        <LectureArchive
          lectures={lectures}
          isLiveConnected={isLiveConnected}
          isSyncing={isSyncing}
          onOpenModal={handleOpenLectureModal}
          selectedCategoryFilter={selectedCategoryFilter}
          onFilterChange={(cat) => setSelectedCategoryFilter(cat)}
        />

        <AdReservation placement="home" />
        {/* Student FAQs */}
        <Classroom />

        {/* Syllabus Tools */}
        <Workbench />

        {/* 3 Step Method */}

        {/* YouTube Channel Banner */}
        <FollowArchive videoCount={lectures.length} />

        {/* TikTok Channel (if configured) */}

        {/* Contact Form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Video Modal */}
      {selectedLecture && (
        <LectureModal
          lecture={selectedLecture}
          allLectures={lectures}
          onClose={handleCloseLectureModal}
          onSelectLecture={(id) => setActiveLectureId(id)}
        />
      )}
    </div>
  );
}
