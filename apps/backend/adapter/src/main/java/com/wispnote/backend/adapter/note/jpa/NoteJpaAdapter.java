package com.wispnote.backend.adapter.note.jpa;

import com.wispnote.backend.adapter.common.exception.EntityNotFoundException;
import com.wispnote.backend.adapter.note.converter.EnrichmentStatusConverter;
import com.wispnote.backend.adapter.note.converter.NoteKindConverter;
import com.wispnote.backend.adapter.note.jpa.entity.NoteEntity;
import com.wispnote.backend.adapter.note.jpa.repository.NoteRepository;
import com.wispnote.backend.adapter.note.jpa.specification.NoteSpecification;
import com.wispnote.backend.adapter.common.util.PaginationUtil;
import com.wispnote.backend.application.common.model.Paginated;
import com.wispnote.backend.application.common.model.PaginationInfo;
import com.wispnote.backend.application.note.model.Note;
import com.wispnote.backend.application.note.model.NoteFilter;
import com.wispnote.backend.application.note.port.NotePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
public class NoteJpaAdapter implements NotePort {

    private final NoteRepository noteRepository;

    @Override
    public Note create(Note note) {
        var entity = new NoteEntity();
        entity.setMemberId(note.memberId());
        entity.setSourceId(note.sourceId());
        entity.setKind(NoteKindConverter.jpa.fromEnum(note.kind()));
        entity.setSelectedText(note.selectedText());
        entity.setUserNote(note.userNote());
        entity.setContextBefore(note.contextBefore());
        entity.setContextAfter(note.contextAfter());
        entity.setSection(note.section());
        entity.setPageNumber(note.pageNumber());
        entity.setLocation(note.location());
        entity.setWindowTitle(note.windowTitle());
        entity.setEnrichmentStatus(EnrichmentStatusConverter.jpa.fromEnum(note.enrichmentStatus()));
        entity.setRawCapture(note.rawCapture());

        return noteRepository.save(entity).toModel();
    }

    @Override
    public Optional<Note> findByIdAndMemberId(UUID id, UUID memberId) {
        return noteRepository.findByIdAndMemberIdAndDeletedFalse(id, memberId)
                .map(NoteEntity::toModel);
    }

    @Override
    public Paginated<Note> findAllByMemberId(UUID memberId, NoteFilter filter, PaginationInfo paginationInfo) {
        var page = noteRepository.findAll(
                NoteSpecification.of(memberId, filter),
                PaginationUtil.fromPaginationInfo(paginationInfo));

        return PaginationUtil.fromPage(page.map(NoteEntity::toModel));
    }

    @Override
    public void deleteByIdAndMemberId(UUID id, UUID memberId) {
            log.info("Deleting note by {}, {}", kv("id", id), kv("memberId", memberId));
            var note = noteRepository.findByIdAndMemberIdAndDeletedFalse(id, memberId)
                            .orElseThrow(EntityNotFoundException::new);
            note.setDeleted(true);
            noteRepository.save(note);
    }
}
